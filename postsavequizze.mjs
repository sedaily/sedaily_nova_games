import {
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

// 공통 헤더 (CORS)
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

export const handler = async (event) => {
  // 1) OPTIONS 프리플라이트 대응
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true }),
    };
  }

  try {
    // 2) body 파싱
    const body = JSON.parse(event.body || "{}");
    const { gameType, quizDate, data } = body;
    const incomingQuestions = data?.questions || [];

    // 3) 최소 유효성 검사
    if (
      !gameType ||
      !quizDate ||
      !Array.isArray(incomingQuestions)
    ) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error:
            "Invalid payload. Need gameType, quizDate, data.questions[].",
          received: body,
        }),
      };
    }

    // (선택) 간단 인증
    // const secretFromClient = event.headers?.["x-admin-secret"];
    // if (secretFromClient !== process.env.ADMIN_SECRET) {
    //   return {
    //     statusCode: 401,
    //     headers: corsHeaders,
    //     body: JSON.stringify({ error: "Unauthorized" }),
    //   };
    // }

    // 4) 기존 레코드 조회 (같은 gameType + quizDate가 이미 있는지)
    const getRes = await docClient.send(
      new GetItemCommand({
        TableName: "quizzes",
        Key: {
          gameType: { S: gameType },
          quizDate: { S: quizDate },
        },
      })
    );

    // 5) 기존 questions 복원
    // GetItemCommand는 AttributeValue 형식으로 주니까
    // DocumentClient.from(client) 쪽으로만 PutCommand를 쓰고,
    // 여기서는 get을 저수준 client로 했기 때문에 수동 언마샬 필요.
    // 👉 간단히: 기존 없으면 빈 배열로 간주
    let existingQuestions = [];
    if (getRes.Item && getRes.Item.data && getRes.Item.data.M && getRes.Item.data.M.questions) {
      const qList = getRes.Item.data.M.questions.L || [];
      existingQuestions = qList.map((q) => {
        // q는 AttributeValue(JSON) 형태라서 다시 JS로 변환
        // 우리는 data.questions 내부 구조를 신뢰하므로 그냥 q.M 기준으로 뽑는다
        const m = q.M || {};
        return {
          question: m.question?.S ?? "",
          answer: m.answer?.S ?? "",
          options: m.options?.L
            ? m.options.L.map((opt) => opt.S ?? "")
            : undefined,
          id: m.id?.S ?? "",
          explanation: m.explanation?.S ?? "",
          questionType: m.questionType?.S ?? "",
          newsLink: m.newsLink?.S ?? "",
          tags: m.tags?.S ?? "",
          relatedArticle: m.relatedArticle?.M
            ? {
                title: m.relatedArticle.M.title?.S ?? "",
                excerpt: m.relatedArticle.M.excerpt?.S ?? "",
              }
            : undefined,
        };
      });
    }

    // 6) 새로 온 문제들과 병합
    //    - 같은 id면 기존 거 유지(중복 추가 안 함)
    //    - 새로운 id면 push
    const byId = new Map();

    // 기존 것 먼저 넣기
    for (const q of existingQuestions) {
      byId.set(q.id, q);
    }
    // 새로 온 것 덮어쓰기 (같은 id면 새 버전으로 교체해도 OK라면 이쪽)
    for (const q of incomingQuestions) {
      byId.set(q.id, q);
    }

    const mergedQuestions = Array.from(byId.values());

    // 7) DynamoDB에 Put (스냅샷 업서트)
    await docClient.send(
      new PutCommand({
        TableName: "quizzes",
        Item: {
          gameType, // PK
          quizDate, // SK
          data: {
            questions: mergedQuestions,
          },
        },
      })
    );

    // 8) 성공 응답
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        saved: {
          gameType,
          quizDate,
          totalQuestions: mergedQuestions.length,
          addedOrUpdated: incomingQuestions.length,
        },
      }),
    };
  } catch (err) {
    console.error("Save quiz error:", err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to save quiz",
        details: err.message || String(err),
      }),
    };
  }
};
