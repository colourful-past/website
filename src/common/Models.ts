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

export const dataSources = [
  {
    code: "slwa",
    name: "Western Australia (SLWA)"
  },
  {
    code: "digitalnz",
    name: "New Zealand (DigitalNZ)"
  },
  {
    code: "state_library_of_nsw_gen",
    name: "NSW (State Library)"
  },
  {
    code: "powerhouse_museum_gen",
    name: "NSW (Powerhouse Museum)"
  },
  {
    code: "state_records_nsw_gen",
    name: "NSW (State Records)"
  },
  {
    code: "state_library_of_queensland_gen",
    name: "Queensland (State Library)"
  },
  {
    code: "tasmanian_archive_and_heritage_office_commons_gen",
    name: "Tasmania (Archive & Heritage)"
  },
  {
    code: "australian_national_maritime_museum_commons_gen",
    name: "National Maritime Museum"
  },
  {
    code: "australian_war_memorial_gen",
    name: "Australian War Memorial"
  },
  {
    code: "national_library_of_australia_commons_gen",
    name: "National Library of Australia"
  }
];