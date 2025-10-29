const RAW_API = "https://api-pioneer.dokdodao.io/api/v1/events/104810264063643648/leader-boards?page=1&limit=130";
const API_URL = "https://corsproxy.io/?" + encodeURIComponent(RAW_API);
const TOTAL_REWARD = 6800;

let leaderboardData = [];
let totalSum = 0;

function getCurrentTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

async function loadLeaderboard() {
  try {
    const res = await fetch(API_URL, { headers: { "Accept": "application/json, text/plain, */*" } });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    leaderboardData = data.items.map(item => ({
      rank: item.rank,
      nickname: item.member.nickname,
      dailyPoint: parseFloat(item.dailyPoint),
      totalPoint: parseFloat(item.totalPoint)
    }));

    totalSum = leaderboardData.reduce((sum, u) => sum + u.totalPoint, 0);

    const currentTime = getCurrentTime();

    document.getElementById("summary").innerHTML =
      `현재 시각: <b>${currentTime}</b><br>
       총 ${leaderboardData.length}명 로드 완료.<br>
       전체 Total Point 합계: <b class="highlight">${totalSum.toFixed(3)}</b>`;

    renderTable(leaderboardData);

  } catch (err) {
    console.error(err);
    document.getElementById("summary").innerHTML =
      `<p class="error">❌ 데이터 로드 실패: ${err.message}</p>
       <p>잠시 후 새로고침(F5)을 눌러 다시 시도해주세요.</p>`;
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#leaderTable tbody");
  tbody.innerHTML = "";
  data.forEach(user => {
    const ratio = (user.totalPoint / totalSum) * 100;
    const reward = (ratio / 100) * TOTAL_REWARD;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.rank}</td>
      <td>${user.nickname}</td>
      <td>${user.dailyPoint.toFixed(3)}</td>
      <td>${user.totalPoint.toFixed(3)}</td>
      <td>${ratio.toFixed(4)}%</td>
      <td>$${reward.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function searchUsers(query) {
  const resultsDiv = document.getElementById("searchResults");
  if (query.length < 2) {
    resultsDiv.innerHTML = "";
    return;
  }

  const results = leaderboardData.filter(u =>
    u.nickname.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p>🔍 "${query}"에 해당하는 유저를 찾을 수 없습니다.</p>`;
    return;
  }

  let html = `<h3>🔍 검색 결과 (${results.length}명)</h3>`;
  html += `<table><thead><tr><th>등수</th><th>닉네임</th><th>Daily</th><th>Total</th><th>비율(%)</th><th>보상($)</th></tr></thead><tbody>`;

  results.forEach(user => {
    const ratio = (user.totalPoint / totalSum) * 100;
    const reward = (ratio / 100) * TOTAL_REWARD;
    html += `
      <tr>
        <td>${user.rank}</td>
        <td>${user.nickname}</td>
        <td>${user.dailyPoint.toFixed(3)}</td>
        <td>${user.totalPoint.toFixed(3)}</td>
        <td>${ratio.toFixed(4)}%</td>
        <td>$${reward.toFixed(2)}</td>
      </tr>`;
  });
  html += "</tbody></table>";

  resultsDiv.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBox").addEventListener("input", e => {
    searchUsers(e.target.value);
  });
  loadLeaderboard();
});


