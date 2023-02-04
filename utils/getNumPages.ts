export const getNumPages = (total: number,limit: number) =>  { 
    let num_pages = 0;

    num_pages += Math.floor(total/limit);

    if(total % limit > 0){
        num_pages += 1;
    }

    return num_pages;
}