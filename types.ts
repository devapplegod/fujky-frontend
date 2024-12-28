export interface ScrapedData {
    date: string;
    publisher: string;
    url: string;
}
  
export interface GeneratedData {
    title: string;
    text: string;
    image: string;
    scraped: ScrapedData;
}
  
export interface Article {
    id: string;
    rating: number;
    generated: GeneratedData;
}