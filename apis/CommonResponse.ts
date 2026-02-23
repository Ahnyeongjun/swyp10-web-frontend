/*
    private boolean success;
    private T data;
    private String message;
    private Integer code;         // 에러 코드(성공 시 null)
    private Object errorDetail;   // 추가 에러 정보(필드에러 등, 필요시)
  */
export interface CommonResponse<T> {
  success: boolean;
  data: T;
  message: string;
  code: number | null;
  errorDetail: Record<string, unknown> | null;
}
