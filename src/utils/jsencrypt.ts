import JSEncrypt from "jsencrypt";

const publicKey =
  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAycie8XM8/x3Hb5mF5QmM\nun024ykE956QwnDHGaUOxpRH7tZFS3zRLlEvKB0xTFneOAPCV0PBruTvYvDHQHHy\ngABuZLVoFC6mRI/CJdjTmLqga/A6hb5RdIi6wzGbcsSHDKSQkqKGg4w8wTMdJqEM\nS7zM02NAV1KISHXnkqab1JquUzCF2gC8e7Of3BxJ/dleBdFi8lvbe2KnyfSePdhB\n7SVlbR5jRdDKK26DhD4UmdPvp9jscCpYgMpn0JaJJn4F5kZ2XT8hSom2zzbxojku\n7n6nnUFHNez6KCNcIsrv2rwc3PQeM/c588B50WX8pMZS7f43O5Rr/swS0/u4UaA2\n1wIDAQAB\n-----END PUBLIC KEY-----";

/**
 * 加密数据
 * @param data 需要加密的数据
 * @returns 加密后的字符串
 */
export function encrypt(data: string): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(data) || "";
}
