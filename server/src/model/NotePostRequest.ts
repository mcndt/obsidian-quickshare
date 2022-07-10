import { IsBase64 } from "class-validator";

/**
 * Request body for creating a note
 */
export class NotePostRequest {
  @IsBase64()
  ciphertext: string | undefined;

  @IsBase64()
  hmac: string | undefined;
}
