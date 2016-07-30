export interface ISearchItem
{
    originalImageUrl: string;
    colourisedImageUrl: string;
    showColourised?: boolean;
    title: string;
    description: string;
    source: string;
}

export interface ISearchResult
{
    items: ISearchItem[];
}

export interface IColouriseResult
{
    url: string;
}