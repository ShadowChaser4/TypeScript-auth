

function dateformatter(date:undefined|any   /*in format dd/mm/yyyy */):Date
{  
    return new Date(date+"T00:00:00Z") //chaning time to 00:00 to set uniformity
}


export {dateformatter}


