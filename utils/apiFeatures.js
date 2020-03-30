
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Building Query 
    // 1. Filtering Query
    const queryObj = {...this.queryString};
    const excludedObj = ['page', 'limit', 'sort', 'fields'];
    excludedObj.forEach(el => delete queryObj[el]);

    //2.  Advanced Filtering
    //eg: http://localhost:8000/api/v1/tours?duration[gte]=9&difficulty=medium
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr);

    this.query.find(queryStr);

    return this; // this here means send this object instance so that the next function in the chain can access it
  }

  sort() {
    // 3. Sort
    if(this.queryString.sort) {
      //sorting via multiple parameters in the orders of their appearance
      //url eg: /tours?sort=price,duration,etc 
      //query.sort('price duration etc');
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }else {
      //default sorting by -ve createdAt parameter so that the newest appears first
      this.query = this.query.sort('-createdAt'); 
    }

    return this;
  }

  limitFields() {
    //4. Field Limiting
    if(this.queryString.fields) {
      //selecting specific fields from the retrieved data
      //url eg: /tours?fields=price,duration,etc 
      //query.selection('price duration etc');
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    }else {
      //removing any unnecessary fields not required by any client
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    //5. Pagination
    const page = Number(this.queryString.page) || 1; // specifies the page number if multiples pages exist
    const limit = Number(this.queryString.limit) || 20; // specified the limit of our results
    const skip = (page-1) * limit; // skip specifies number of results that are to be skipped to reach the speicified page 
    
    //url eg: /tours?page=3&limit=10 , page1: 1-10, page2: 11-20, page3: 21-30, skip = 20, so that we react 21-30 result
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

}

module.exports = ApiFeatures;