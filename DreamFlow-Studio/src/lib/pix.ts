/**
 * Gerador de payload Pix estático (BR Code / EMV QRCPS) — usado para gerar o
 * código "copia e cola" e o QR Code de cobrança nos orçamentos.
 */

function tlv(id: string, value: string) {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid = "***",
  message,
}: {
  key: string;
  name: string;
  city: string;
  amount?: number;
  txid?: string;
  message?: string;
}) {
  const cleanName = stripAccents(name).replace(/[^A-Za-z0-9 ]/g, "").slice(0, 25).trim() || "DREAM ARTE";
  const cleanCity = stripAccents(city).replace(/[^A-Za-z0-9 ]/g, "").slice(0, 15).trim() || "SAO PAULO";
  const cleanTxid = (txid || "***").replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";

  const merchantAccountInfo = tlv(
    "26",
    tlv("00", "br.gov.bcb.pix") +
      tlv("01", key) +
      (message ? tlv("02", stripAccents(message).slice(0, 40)) : ""),
  );

  const additionalData = tlv("62", tlv("05", cleanTxid));

  let payload =
    tlv("00", "01") +
    merchantAccountInfo +
    tlv("52", "0000") +
    tlv("53", "986") +
    (amount && amount > 0 ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", cleanName) +
    tlv("60", cleanCity) +
    additionalData;

  payload += "6304";
  const checksum = crc16(payload);
  return `${payload}${checksum}`;
}
