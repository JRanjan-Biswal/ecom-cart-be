const { connectToDatabase } = require('./db-connection');
const User = require('./models/User');
const Product = require('./models/Product');

// Check if we're in Vercel (serverless environment)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Wrapper to make Mongoose work like NeDB
class MongooseAdapter {
  constructor(model) {
    this.model = model;
  }

  findOne(query, callback) {
    this.model.findOne(query)
      .lean() // Convert Mongoose document to plain JavaScript object
      .then(doc => callback(null, doc))
      .catch(err => callback(err, null));
  }

  find(query = {}, projection = null, options = {}, callback) {
    // Determine if callback is passed in different positions
    let actualCallback = callback;
    let actualOptions = options;
    
    // If projection is a function, it's the callback
    if (typeof projection === 'function') {
      actualCallback = projection;
      actualOptions = {};
    }
    // If options is a function, it's the callback
    else if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = {};
    }
    
    let queryBuilder = this.model.find(query);
    
    // Handle sorting if provided in options
    if (actualOptions && actualOptions.sort) {
      queryBuilder = queryBuilder.sort(actualOptions.sort);
    }
    
    queryBuilder
      .lean() // Convert Mongoose documents to plain JavaScript objects
      .exec()
      .then(docs => actualCallback(null, docs))
      .catch(err => actualCallback(err, null));
  }

  insert(doc, callback) {
    this.model.create(doc)
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  }

  update(query, update, options, callback) {
    // Determine callback position
    let actualCallback = callback;
    let actualUpdate = update;
    let actualOptions = options;
    
    if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = {};
    } else if (typeof update === 'function') {
      actualCallback = update;
      actualUpdate = {};
      actualOptions = {};
    }
    
    // Convert $set to Mongoose update format
    let updateObj = {};
    if (actualUpdate.$set) {
      Object.assign(updateObj, actualUpdate.$set);
    } else {
      updateObj = actualUpdate;
    }
    
    this.model.updateOne(query, updateObj)
      .then(result => actualCallback(null, result))
      .catch(err => actualCallback(err, null));
  }

  remove(query, callback) {
    this.model.deleteOne(query)
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  }
}

let initialized = false;

async function initialize() {
  if (!initialized) {
    await connectToDatabase();
    initialized = true;
  }
}

// Initialize on first load (for serverless)
if (isServerless) {
  initialize().catch(console.error);
}

// Create adapters
const users = new MongooseAdapter(User);
const products = new MongooseAdapter(Product);

module.exports.users = users;
module.exports.products = products;
module.exports.initialize = initialize;