export type Bookmark = {
    id: string;
    created_at: string;
    user_id: string;
    title: string;
    url: string;
    summary: string | null;
    is_favorite: boolean;
    tags: string[];
};

export type SortOption =
    | "date-desc"
    | "date-asc"
    | "title-asc"
    | "title-desc"
    | "url-asc"
    | "url-desc";

export type ViewMode = "grid" | "list";
