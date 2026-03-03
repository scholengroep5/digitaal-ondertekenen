/* global Office */

let selectedAttachment = null;
let currentJobId = null;
let pollTimer = null;

Office.onReady(function (info) {
  if (info.host === Office.HostType.Outlook) {
    loadAttachments();
  }
});

function loadAttachments() {
  const item = Office.context.mailbox.item;
  const list = document.getElementById('attachmentList');
  const btn = document.getElementById('signBtn');

  if (!item.attachments || item.attachments.length === 0) {
    list.innerHTML = '<li class="no-pdf">Geen bijlagen gevonden.</li>';
    return;
  }

  const pdfs = item.attachments.filter(function (att) {
    return att.name.toLowerCase().endsWith('.pdf') && !att.isInline;
  });

  if (pdfs.length === 0) {
    list.innerHTML = '<li class="no-pdf">Geen PDF-bijlagen gevonden.</li>';
    return;
  }

  list.innerHTML = '';
  pdfs.forEach(function (att, i) {
    var li = document.createElement('li');
    li.className = 'attachment-item';
    li.innerHTML =
      '<input type="radio" name="att" id="att-' + i + '" />' +
      '<label class="attachment-name" for="att-' + i + '">' + escapeHtml(att.name) + '</label>' +
      '<span class="attachment-size">' + formatSize(att.size) + '</span>';

    li.addEventListener('click', function () {
      document.querySelectorAll('.attachment-item').forEach(function (el) {
        el.classList.remove('selected');
      });
      li.classList.add('selected');
      li.querySelector('input').checked = true;
      selectedAttachment = att;
      btn.disabled = false;
    });

    list.appendChild(li);
  });

  btn.addEventListener('click', startSigning);
}

function startSigning() {
  if (!selectedAttachment) return;
  var btn = document.getElementById('signBtn');
  btn.disabled = true;
  setStatus('uploading', '<span class="spinner"></span> Document uploaden...');

  Office.context.mailbox.item.getAttachmentContentAsync(
    selectedAttachment.id,
    function (result) {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        setStatus('error', 'Fout bij ophalen bijlage: ' + result.error.message);
        btn.disabled = false;
        return;
      }

      var base64 = result.value.content;
      sendToServer(selectedAttachment.name, base64);
    }
  );
}

function sendToServer(filename, contentBase64) {
  fetch('/api/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: filename, content_base64: contentBase64 }),
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.error) {
        setStatus('error', 'Fout: ' + data.error);
        return;
      }
      currentJobId = data.id;
      setStatus('pending', '<span class="spinner"></span> Wachten op ITSME-ondertekening...');
      startPolling();
    })
    .catch(function (err) {
      setStatus('error', 'Serverfout: ' + err.message);
    });
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(function () {
    fetch('/api/status/' + currentJobId)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status === 'signed') {
          clearInterval(pollTimer);
          pollTimer = null;
          setStatus('signed', 'Ondertekend! Document opgeslagen.');
          document.getElementById('signBtn').disabled = false;
        }
      })
      .catch(function () {
        // Keep polling on transient errors
      });
  }, 3000);
}

function setStatus(type, html) {
  var area = document.getElementById('statusArea');
  var text = document.getElementById('statusText');
  area.className = 'status-area visible status-' + type;
  text.innerHTML = html;
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
