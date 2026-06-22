import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "./password";

test("verifyPassword accepts a matching password", () => {
  const hash = hashPassword("ChangeMe123!");
  assert.equal(verifyPassword("ChangeMe123!", hash), true);
});

test("verifyPassword rejects an invalid password", () => {
  const hash = hashPassword("ChangeMe123!");
  assert.equal(verifyPassword("wrong-password", hash), false);
});
