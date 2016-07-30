export interface ISearchItem
{
    originalImageUrl: string;
    colourisedImageUrl: string;
    title: string;
    description: string;
    source: string;
}

export interface ISearchResult
{
    items: ISearchItem[];
}