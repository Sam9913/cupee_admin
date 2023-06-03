export interface Event {
    id:number;
    name:string;
    fanbase_name:string;
    venue_name:string;
    idol_name:string;
    date:string[];
    start_time:string[];
    end_time:string[];
    image_url:string;
    is_booking_need:boolean;
}


export interface EventDetail {
    id:number;
    name:string;
    fanbase_id:number;
    venue_id:number;
    idol_id:number;
    datetime:string[];
    image_url:string;
    faq:string;
    is_booking_need:boolean;
    booking_amount:number;
}
