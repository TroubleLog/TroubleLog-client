export const STEPS_META = [
  { name: "코드 제출", desc: "핵심 로직 코드 입력" },
  { name: "컨텍스트 입력", desc: "설계 의도 및 배경 수집" },
  { name: "질문 & 답변", desc: "AI 맞춤형 질문 및 답변" },
  { name: "리포트 확인", desc: "트러블슈팅 리포트 생성" },
];
export const CTX_META = [
  {
    id: "intent",
    label: "기능 설명",
    sub: "어떤 기능을 수행하는 코드인가요?",
    ph: "예시) 로그인/회원가입, 게시판 CRUD 등",
  },
  {
    id: "alt",
    label: "예외 처리",
    sub: "어떤 예외 상황을 고려했나요?",
    ph: "예시) 과거 날짜 예약 방지, 중복 데이터 처리 등",
  },
  {
    id: "edge",
    label: "기술 선택 이유",
    sub: "이 프로젝트에서 사용한 기술 스택 중 직접 선택한 것이 있다면, 왜 그 기술을 골랐나요?",
    ph: "예시) 라이브러리, 프레임워크, DB, 디자인 패턴 등",
  },
  {
    id: "scale",
    label: "프로젝트 규모 및 기간",
    sub: "프로젝트 팀 규모와 구현 기간이 어떻게 되나요?",
    ph: "예시) 4인 개발팀, 3주",
  },
];
export const BADGE_TYPE = {
  "기술 의사결정": "tech",
  "트러블슈팅": "trouble",
  "설계 의도": "intent",
};
export const MOCK_CODE = `async function processOrder(orderId, userId) {
  const order = await db.orders.findById(orderId);
  const items = order.items;

  for (const item of items) {
    const stock = await db.inventory.findByProductId(item.productId);
    if (stock.quantity < item.quantity) throw new Error('재고 부족: ' + item.productId);
  }

  const payment = await paymentService.charge({
    userId, amount: order.totalAmount, currency: 'KRW'
  });
  if (!payment.success) throw new Error('결제 실패');

  await Promise.all([
    ...items.map(item => db.inventory.decrement(item.productId, item.quantity)),
    db.orders.updateStatus(orderId, 'CONFIRMED')
  ]);
  return { orderId, status: 'CONFIRMED', paymentId: payment.id };
}`;
export const MOCK_QUESTIONS = [
  {
    type: "기술 의사결정",
    question:
      "재고 확인 로직을 for...of 루프로 순차 처리했는데, 이 방식을 선택한 이유가 있나요? Promise.all로 병렬 처리했을 때와 어떤 트레이드오프가 있다고 생각하시나요?",
    hint: "race condition, 순차 보장, DB 부하",
  },
  {
    type: "트러블슈팅",
    question:
      "결제 처리 성공 후 재고 차감 중 일부 항목에서 오류가 발생하는 경우, 현재 코드에서는 어떤 문제가 발생하나요? 실제로 이런 상황이 발생했다면 어떻게 대응했나요?",
    hint: "부분 실패, 보상 트랜잭션, 롤백 전략",
  },
  {
    type: "설계 의도",
    question:
      "동시에 수천 건의 주문이 들어오는 상황을 가정할 때, 현재 구조에서 예상되는 병목 지점은 어디인가요? 어떤 방식으로 개선할 수 있을지 설명해주세요.",
    hint: "DB connection pool, 낙관적 잠금, 큐 기반 처리",
  },
];
export const MOCK_REPORT = `## Background\n이 코드는 이커머스 주문 처리 서비스의 핵심 로직으로, 재고 확인 → 결제 → 재고 차감 순서의 트랜잭션을 처리합니다.\n\n## Problem\n재고 확인과 결제 처리 사이의 **TOCTOU 경쟁 조건** 문제가 잠재적으로 존재합니다.\n\n## Root Cause\n\`findByProductId\` 조회 시점과 \`decrement\` 시점 사이에 DB 수준의 락이 없어 동시 요청이 동일한 재고 값을 읽게 됩니다.\n\n## Resolution\nDB 수준의 **낙관적 잠금(Optimistic Locking)** 과 버전 필드를 도입해 동시 업데이트 충돌을 감지합니다.\n\n## Result\n부하 테스트(1,000 TPS)에서 오버셀링 발생률이 **100% → 0%** 로 감소했습니다.`;
export const MOCK_RADAR = [
  { label: "기술 선택", val: 80 },
  { label: "문제 해결", val: 72 },
  { label: "코드 품질", val: 68 },
  { label: "설계 이해", val: 76 },
  { label: "협업", val: 60 },
  { label: "성장", val: 84 },
];
export const MOCK_FEEDBACK = [
  "핵심 방향을 잘 짚으셨습니다. 실제 race condition이 발생했을 때 어떤 데이터 불일치가 생기는지 구체적인 시나리오를 추가하면 훨씬 설득력 있는 답변이 됩니다.",
  "장애 상황 인식과 대응 방향이 좋습니다. 보상 트랜잭션(Saga 패턴)이나 2PC, 멱등성 처리를 언급하면 심층도가 올라갑니다.",
  "방향성이 좋습니다. Redis, Kafka, DB connection pool 튜닝 등 구체적인 기술 스택을 예시로 들고 개선 전후 수치를 넣어주세요.",
];
