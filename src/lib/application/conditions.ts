export type ApplicationFieldCondition = {
  field: string;
  equals?: unknown;
  notEquals?: unknown;
};

export type AnswerCondition = {
  answerKey: string;
  equals: string;
};

export type DocumentVisibilityCondition = AnswerCondition;

export function conditionMatches(
  condition: ApplicationFieldCondition | AnswerCondition | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!condition) return true;

  const answerKey = "answerKey" in condition ? condition.answerKey : condition.field;
  const actual = answers[answerKey];

  if ("equals" in condition && condition.equals !== undefined) return actual === condition.equals;
  if ("notEquals" in condition && condition.notEquals !== undefined)
    return actual !== condition.notEquals;

  return true;
}
