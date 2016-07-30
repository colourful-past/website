export interface ISearchItem
{
    orginalImageUrl: string;
    colourisedImageUrl: string;
    title: string;
    description: string;
}

export interface ISearchResult
{
    items: ISearchItem[];
}