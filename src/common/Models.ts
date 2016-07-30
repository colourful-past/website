export interface ISearchItem
{
    originalImageUrl: string;
    colourisedImageUrl: string;
    showColourised?: boolean;
    title: string;
    description: string;
    source: string;
    isColourising?: boolean;
}

export interface ISearchResult
{
    items: ISearchItem[];
}

export interface IColouriseResult
{
    url: string;
}

export const dataSources = ["slwa", "digitalnz", "flickr_search"];