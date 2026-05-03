const agents = [
  {
    name: "Brief 拆解",
    detail: "提取品牌、产品、卖点、人群和禁用表达。"
  },
  {
    name: "达人匹配",
    detail: "锁定凌二七，保留文静不pang作为备选。"
  },
  {
    name: "脚本生成",
    detail: "生成早餐、运动后、下午茶三场景口播。"
  },
  {
    name: "分镜设计",
    detail: "拆成 8 个可拍镜头，覆盖产品特写和成品展示。"
  },
  {
    name: "合规质检",
    detail: "过滤减肥、降糖、治疗、代餐等高风险表达。"
  }
];

const demo = {
  title: "搭配好了！3 款高蛋白酸奶早餐，早八也能好好吃饭",
  hook: "如果你早上总是来不及吃饭，或者运动后很想吃点甜的，今天这 3 个酸奶搭配可以直接抄作业。",
  script: [
    "大家好，我是凌二七。",
    "如果你早上总是来不及吃饭，或者运动后很想吃点甜的，今天这 3 个酸奶搭配可以直接抄作业。",
    "我最近常吃的是轻醒 0 蔗糖高蛋白希腊酸奶。它的质地比普通酸奶更厚一点，舀起来是比较扎实的厚酸奶感。",
    "第一碗是蓝莓燕麦酸奶碗。蓝莓味酸奶打底，加即食燕麦、蓝莓、坚果，再撒一点奇亚籽。这个搭配不用开火，早上十分钟就能做好。",
    "第二个是黄桃酸奶吐司杯。把吐司切成小块垫底，铺上黄桃味希腊酸奶，再加黄桃丁和一点椰子片。吃起来有点像不用烤箱的小甜品，下午茶也很合适。",
    "第三个是原味酸奶咸口碗。原味希腊酸奶加一点黑胡椒和柠檬汁，旁边放水煮蛋、番茄、牛油果和全麦贝果。这个更适合运动后，想吃得扎实一点但又不想太油的时候。",
    "如果你也在找早餐、运动后或者下午茶的低负担搭子，可以试试轻醒这三个口味。原味更百搭，蓝莓和黄桃更适合直接做甜口酸奶碗。",
    "想看一周早餐清单的话，可以评论区告诉我。也可以先收藏，明早不知道吃什么的时候直接照着做。"
  ],
  shots: [
    ["0-6s", "俯拍餐桌，三款成品和三杯轻醒酸奶快速入画。", "3 款高蛋白酸奶早餐"],
    ["6-14s", "原味、蓝莓、黄桃依次转正，勺子舀起酸奶展示厚质地。", "0 蔗糖｜高蛋白｜希腊酸奶"],
    ["14-28s", "蓝莓味酸奶倒入碗，加入燕麦、蓝莓、坚果、奇亚籽。", "蓝莓 + 燕麦 + 坚果"],
    ["28-42s", "透明杯中铺吐司块，加入黄桃酸奶和黄桃丁。", "黄桃酸奶吐司杯"],
    ["42-58s", "原味酸奶加入黑胡椒和柠檬汁，搭配鸡蛋、番茄、牛油果。", "原味更百搭｜可甜可咸"],
    ["58-68s", "真人坐在餐桌前试吃，镜头自然固定。", "甜口咸口都能搭"],
    ["68-78s", "三款成品和三杯产品同框，镜头轻微推进。", "原味百搭，蓝莓黄桃适合甜口"],
    ["78-88s", "真人对镜收尾，手边放产品和早餐碗。", "收藏明早做｜好好吃饭"]
  ],
  risks: [
    ["通过", "当前脚本已避免减肥、治疗、降糖、替代正餐等食品类高风险表达。", "good"],
    ["可用表达", "0 蔗糖、高蛋白、希腊酸奶、低负担、早餐搭配、运动后加餐。", "good"],
    ["谨慎表达", "控糖友好、代餐、减脂餐、撑到中午需要替换为更稳妥说法。", "warn"],
    ["录制前确认", "复核产品包装营养数据，避免达人临场加入吃了不胖、减脂必备等表达。", "warn"]
  ]
};

const track = document.querySelector("#agentTrack");
const form = document.querySelector("#briefForm");
const resetButton = document.querySelector("#resetDemo");
const runStatus = document.querySelector("#runStatus");
const scriptTitle = document.querySelector("#scriptTitle");
const scriptHook = document.querySelector("#scriptHook");
const scriptBody = document.querySelector("#scriptBody");
const shotList = document.querySelector("#shotList");
const riskGrid = document.querySelector("#riskGrid");
const tabs = document.querySelectorAll(".tab");
const panels = {
  script: document.querySelector("#scriptPanel"),
  storyboard: document.querySelector("#storyboardPanel"),
  risk: document.querySelector("#riskPanel"),
  delivery: document.querySelector("#deliveryPanel")
};

function renderAgents(activeIndex = -1, doneIndex = -1) {
  track.innerHTML = agents
    .map((agent, index) => {
      const state = index === activeIndex ? "active" : index <= doneIndex ? "done" : "";
      return `
        <div class="agent-step ${state}">
          <div class="step-dot">${index <= doneIndex ? "✓" : index + 1}</div>
          <div>
            <h3>${agent.name}</h3>
            <p>${agent.detail}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderResults() {
  scriptTitle.textContent = demo.title;
  scriptHook.textContent = demo.hook;
  scriptBody.innerHTML = demo.script.map((line) => `<p>${line}</p>`).join("");

  shotList.innerHTML = demo.shots
    .map(
      ([time, scene, caption], index) => `
        <div class="shot-card">
          <div class="shot-time">${time}</div>
          <div>
            <h3>镜头 ${index + 1}</h3>
            <p>${scene}</p>
            <p>${caption}</p>
          </div>
        </div>
      `
    )
    .join("");

  riskGrid.innerHTML = demo.risks
    .map(
      ([title, body, type]) => `
        <div class="risk-card ${type}">
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
      `
    )
    .join("");

  document.querySelector("#matchMetric").textContent = "9/10";
  document.querySelector("#timeMetric").textContent = "75-85s";
  document.querySelector("#shotMetric").textContent = "8";
}

function setTab(tabName) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  Object.entries(panels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === tabName);
  });
}

function runDemo() {
  form.querySelector(".primary-action").disabled = true;
  runStatus.textContent = "生成中";
  renderAgents(0, -1);

  agents.forEach((_, index) => {
    window.setTimeout(() => {
      renderAgents(index + 1, index);
      if (index === agents.length - 1) {
        renderAgents(-1, agents.length - 1);
        renderResults();
        runStatus.textContent = "已完成";
        form.querySelector(".primary-action").disabled = false;
        setTab("script");
      }
    }, 420 * (index + 1));
  });
}

function resetDemo() {
  renderAgents();
  runStatus.textContent = "待生成";
  scriptTitle.textContent = "等待生成脚本";
  scriptHook.textContent = "点击“生成方案”后展示完整口播。";
  scriptBody.innerHTML = "";
  shotList.innerHTML = "";
  riskGrid.innerHTML = "";
  document.querySelector("#matchMetric").textContent = "-";
  document.querySelector("#timeMetric").textContent = "-";
  document.querySelector("#shotMetric").textContent = "-";
  setTab("script");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runDemo();
});

resetButton.addEventListener("click", resetDemo);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});

resetDemo();
