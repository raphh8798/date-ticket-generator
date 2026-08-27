/* =========================================================
   데이트 신청 사이트 - 기능 구현 스켈레톤
   디자인(HTML/CSS)은 완성되어 있고, 아래 함수들의 로직만
   비어 있습니다. 자세한 구현 방법은 GUIDE.md 를 참고하세요.
   각 함수 옆 주석의 "GUIDE.md > n."을 찾아가면 됩니다.
   ========================================================= */

// ---------------------------------------------------------
// 상태: 사용자가 각 단계에서 선택/입력한 값을 담는 객체
// ---------------------------------------------------------
const dateData = {
  from: '',       // 보내는 사람 이름
  to: '',         // 받는 사람 이름
  type: '',       // 데이트 종류 (2단계)
  date: '',       // 날짜 (3단계)
  time: '',       // 시간 (3단계)
  place: '',      // 장소 (4단계)
  seat: '',       // 좌석 등급 (5단계)
  requests: [],   // 특별 요청사항 (6단계, 배열)
  message: '',    // 한마디 메시지 (7단계)
};

let msgIndex = 0;

// 도망 버튼 문구들 (원하는 대로 수정해도 됩니다)
const NO_ESCAPE_MESSAGES = [
  '',
  '응?',
  '지금 NO 하려는 거야?',
  '다시 한 번 생각해봐',
  '기회를 줄게',
  '진짜 이러기야?',
  '🥺...',
  '🥺🥺🥺',
  '너무해',
  '너 진짜 그렇게 해',
  '...'
];

// ---------------------------------------------------------
// 초기화
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', init);

function init() {
  var params = new URLSearchParams(location.search);
  var fromParam = null;
  var toParam = null;

  var dParam = params.get('d');
  if (dParam) {
    try {
      var decoded = JSON.parse(fromBase64Url(dParam));
      fromParam = decoded.from;
      toParam = decoded.to;
    } catch (e) {
      // 손상된 링크면 무시하고 이름 입력 화면으로
    }
  }

  if(fromParam && toParam){
    dateData.from = fromParam;
    dateData.to = toParam;
    document.getElementById('introTitle').textContent = `${fromParam}님이 ${toParam}님에게 메시지를 보냈어요`;
    document.getElementById('introSubtitle').textContent = `${fromParam}님이 ${toParam}님에게 데이트를 신청하려고 해요`;
    
    goToStep('intro');
  }

  setupNameStep();
  setupRunawayButton();
  setupOptionCards();
  setupDateTimeStep();
  setupRequestCheckboxes();
  setupMessageStep();
  setupResultActions();
  setupPrevButtons();
}

// ---------------------------------------------------------
// 단계 전환
// ---------------------------------------------------------

// 단계 순서 (진행바 계산에 사용). 0단계/인트로는 진행바에 포함하지 않음.
const STEP_ORDER = ['ask', 'type', 'datetime', 'place', 'seat', 'requests', 'message', 'result'];

function goToStep(stepId) {
  document.querySelectorAll('.step').forEach((el) => {
    el.classList.toggle('active', el.dataset.step === stepId);
  });

  updateProgressBar(stepId);

}

function updateProgressBar(stepId) {
  var index = STEP_ORDER.indexOf(stepId);
  var fill = document.getElementById('progressFill');

  if (index === -1) {
    fill.style.width = '0%';
    return;
  }

  var percent = ((index + 1) / STEP_ORDER.length) * 100;
  fill.style.width = `${percent}%`;
}

function setupPrevButtons() {
  document.querySelectorAll('.btn-prev').forEach((btn) => {
    btn.addEventListener('click', () => goToStep(btn.dataset.prevTarget));
  });
}

// ---------------------------------------------------------
// 0-A단계: 이름 입력
// ---------------------------------------------------------
function setupNameStep() {
  document.getElementById('btn-create-link').addEventListener('click', () => {
    var fromNm = document.getElementById('input-from-name').value.trim();
    var toNm = document.getElementById('input-to-name').value.trim();
    
    if(!fromNm || !toNm) return;

    dateData.from = fromNm;
    dateData.to = toNm;
    createShareLink();
    goToStep('share');
  });

}

// ---------------------------------------------------------
// 0-B단계: 공유 링크 화면
// ---------------------------------------------------------
document.getElementById('btn-copy-link').addEventListener('click', () => { copyShareLink(); });
document.getElementById('btn-native-share').addEventListener('click', () => { nativeShareLink(); });
document.getElementById('btn-make-new-link').addEventListener('click', () => { goToStep('names'); });

function toBase64Url(str) {
  var b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url) {
  var b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return decodeURIComponent(escape(atob(b64)));
}

function createShareLink() {
  var url = new URL(location.href);
  url.search = '';
  var payload = JSON.stringify({ from: dateData.from, to: dateData.to });
  url.searchParams.set('d', toBase64Url(payload));
  document.getElementById('share-link-output').value = url.toString();  

}

function copyShareLink() {
  var input = document.getElementById('share-link-output');
  navigator.clipboard.writeText(input.value).then(() => {
    var hint = document.getElementById('copiedHint');
    hint.hidden = false;
    setTimeout(() => { hint.hidden = true; }, 1500);
  });

}

function nativeShareLink() {
  var url = document.getElementById('share-link-output').value;
  if (navigator.share) {
    navigator.share({ title: '데이트 신청 💌', text: `${dateData.from}님이 보낸 데이트 신청이에요!`, url });
  } else {
    copyShareLink();
  }
}

// ---------------------------------------------------------
// 받는 사람 인트로 화면
// ---------------------------------------------------------
document.getElementById('btn-intro-continue').addEventListener('click', () => { goToStep('ask'); });

// ---------------------------------------------------------
// 1단계: No버튼 도망 로직
// ---------------------------------------------------------
function setupRunawayButton() {
  var stage = document.getElementById('askStage');
  var noBtn = document.getElementById('btn-no');
  var yesBtn = document.getElementById('btn-yes');
  var message = document.getElementById('noEscapeMessage');
  document.getElementById('askQuestion').textContent = `${dateData.to || '너'}, 나랑 데이트 할래?`;

  // No 버튼을 스테이지 안 랜덤 위치로 이동 (Yes 버튼과 겹치지 않게)
  function moveNoBtnRandom() {
    var stageRect = stage.getBoundingClientRect();
    var btnRect = noBtn.getBoundingClientRect();
    var yesRect = yesBtn.getBoundingClientRect();

    var maxLeft = stageRect.width - btnRect.width;
    var maxTop = stageRect.height - btnRect.height;

    // Yes 버튼의 스테이지 기준 좌표
    var yesLocalLeft = yesRect.left - stageRect.left;
    var yesLocalTop = yesRect.top - stageRect.top;

    var newLeft, newTop;
    var attempts = 0;
    var maxAttempts = 50;

    do {
      newLeft = Math.random() * Math.max(maxLeft, 0);
      newTop = Math.random() * Math.max(maxTop, 0);
      attempts++;
    } while (
      attempts < maxAttempts &&
      newLeft < yesLocalLeft + yesRect.width &&
      newLeft + btnRect.width > yesLocalLeft &&
      newTop < yesLocalTop + yesRect.height &&
      newTop + btnRect.height > yesLocalTop
    );

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;

    msgIndex++;
    message.textContent = NO_ESCAPE_MESSAGES[msgIndex];

    // No를 누를 때마다 Yes 버튼이 조금씩 커짐
    var scale = 1 + msgIndex * 0.1;
    yesBtn.style.transform = `scale(${scale})`;

    if (msgIndex >= NO_ESCAPE_MESSAGES.length) {
      message.textContent = '됐어나도너랑데이트안해나삐졌어';
      yesBtn.style.display = 'none';
    }
  }

  // 클릭(터치 포함)으로 통일: No 버튼을 클릭하면 랜덤한 위치로 이동
  noBtn.addEventListener('click', moveNoBtnRandom);

  yesBtn.addEventListener('click', () => { goToStep('type'); });
}

// ---------------------------------------------------------
// 2 / 4 / 5단계: 카드 선택 공통 처리
// ---------------------------------------------------------
function setupOptionCards() {
  document.querySelectorAll('.card-grid').forEach((grid) => {
    var group = grid.dataset.group; // 'type' | 'place' | 'seat'

    grid.querySelectorAll('.option-card').forEach((card) => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        dateData[group] = card.dataset.value;

        if (group === 'type') document.getElementById('btn-next-type').disabled = false;
        if (group === 'place') document.getElementById('btn-next-place').disabled = false;
        if (group === 'seat') document.getElementById('btn-next-seat').disabled = false;
      });
    });
  });

  // 장소 직접 입력: 입력하면 카드 선택보다 우선
  document.getElementById('input-place-custom').addEventListener('input', (e) => {
    if (e.target.value.trim()) {
      dateData.place = e.target.value.trim();
      document.getElementById('btn-next-place').disabled = false;
    }
  });

  document.getElementById('btn-next-type').addEventListener('click', () => goToStep('datetime'));
  document.getElementById('btn-next-place').addEventListener('click', () => goToStep('seat'));
  document.getElementById('btn-next-seat').addEventListener('click', () => goToStep('requests'));
}

// ---------------------------------------------------------
// 3단계: 날짜 / 시간
// ---------------------------------------------------------
function setupDateTimeStep() {
  var dateInput = document.getElementById('input-date');
  var timeInput = document.getElementById('input-time');
  var nextBtn = document.getElementById('btn-next-datetime');

  function checkFilled() {
    nextBtn.disabled = !(dateInput.value && timeInput.value);
  }

  dateInput.addEventListener('change', () => { dateData.date = dateInput.value; checkFilled(); });
  timeInput.addEventListener('change', () => { dateData.time = timeInput.value; checkFilled(); });

  nextBtn.addEventListener('click', () => goToStep('place'));
}

// ---------------------------------------------------------
// 6단계: 특별 요청사항 체크박스
// ---------------------------------------------------------
function setupRequestCheckboxes() {
  var checkboxes = document.querySelectorAll('.request-checkbox');

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      dateData.requests = Array.from(checkboxes)
        .filter((c) => c.checked)
        .map((c) => c.value);
    });
  });

  document.getElementById('btn-next-requests').addEventListener('click', () => goToStep('message'));
}

// ---------------------------------------------------------
// 7단계: 한마디 메시지
// ---------------------------------------------------------
function setupMessageStep() {
  var textarea = document.getElementById('input-message');
  textarea.addEventListener('input', () => { dateData.message = textarea.value.trim(); });

  document.getElementById('btn-next-message').addEventListener('click', () => {
    renderTicket();
    goToStep('result');
  });
}

// ---------------------------------------------------------
// 결과 화면: 티켓에 값 채우기
// ---------------------------------------------------------
function renderTicket() {
  document.getElementById('ticketFrom').textContent = dateData.from || '-';
  document.getElementById('ticketTo').textContent = dateData.to || '-';
  document.getElementById('ticketType').textContent = dateData.type || '-';
  document.getElementById('ticketDate').textContent = dateData.date || '-';
  document.getElementById('ticketTime').textContent = dateData.time || '-';
  document.getElementById('ticketPlace').textContent = dateData.place || '-';
  document.getElementById('ticketSeat').textContent = dateData.seat || '-';
  document.getElementById('ticketRequests').textContent =
    dateData.requests.length ? dateData.requests.join(', ') : '-';
  document.getElementById('ticketMessage').textContent = dateData.message ? `"${dateData.message}"` : '';

  // 오른쪽 스텁(찢어지는 조각)에도 핵심 정보를 반복 표기 (실제 영화 티켓처럼)
  var ticketNo = generateTicketNumber();
  document.getElementById('ticketNo').textContent = ticketNo;
  document.getElementById('stubNo').textContent = ticketNo;
  document.getElementById('stubDate').textContent = dateData.date || '-';
  document.getElementById('stubTime').textContent = dateData.time || '-';
  document.getElementById('stubSeat').textContent = dateData.seat || '-';

  renderBarcode(ticketNo);
}

// 바코드 막대 그리기 (티켓 번호를 시드로 막대 폭을 결정해 매번 같은 티켓은 같은 무늬가 나오게 함)
function renderBarcode(seedText) {
  var container = document.getElementById('ticketBarcode');
  container.innerHTML = '';

  var seed = 0;
  for (var i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;

  function nextRandom() {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return (seed % 1000) / 1000;
  }

  var barCount = 46;
  for (var j = 0; j < barCount; j++) {
    var bar = document.createElement('span');
    bar.className = 'barcode-bar';
    var width = 1 + Math.round(nextRandom() * 3); // 1~4px
    bar.style.width = `${width}px`;
    container.appendChild(bar);
  }
}

// 티켓 번호 생성: 날짜 기반 + 랜덤 4자리
function generateTicketNumber() {
  var rand = Math.floor(1000 + Math.random() * 9000);
  var datePart = (dateData.date || '').replace(/-/g, '');
  return `${datePart || '0000'}-${rand}`;
}

// ---------------------------------------------------------
// 티켓 다운로드 / 공유
// ---------------------------------------------------------
function setupResultActions() {
  document.getElementById('btn-download').addEventListener('click', downloadTicket);
  document.getElementById('btn-share').addEventListener('click', shareTicket);
}

function downloadTicket() {
  html2canvas(document.getElementById('ticket'), { scale: 2, backgroundColor: null }).then((canvas) => {
    var link = document.createElement('a');
    link.download = `date-ticket-${dateData.to || 'ticket'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

function shareTicket() {
  html2canvas(document.getElementById('ticket'), { scale: 2, backgroundColor: null }).then((canvas) => {
    canvas.toBlob((blob) => {
      var file = new File([blob], 'date-ticket.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: '데이트 티켓 🎫',
          text: `${dateData.from} → ${dateData.to} 데이트 티켓!`,
        });
      } else {
        downloadTicket(); // 공유 API 미지원 브라우저는 다운로드로 대체
      }
    }, 'image/png');
  });
}
