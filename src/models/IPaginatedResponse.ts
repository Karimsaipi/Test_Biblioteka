// ===================== DTO (API) ======================

export interface IPaginatedResponse<T> {
    data: T[];
    totalCount: number;
}