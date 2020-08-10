const {
  validateCatalog,
  validateCoverImage,
} = require('../../../../server/models/Catalog');

let reqbody;

describe('validateCatalog function', () => {
  beforeEach(() => {
    reqbody = {
      brand: 'sugoi',
      season: 'CUSTOM',
      year: '2020',
      coverImg: 'http://image.website.com',
    };
  });

  it('should return an error if brand is not provided', () => {
    delete reqbody.brand;
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if brand is an empty string', () => {
    reqbody.brand = '';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if season is not provided', () => {
    delete reqbody.season;
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if season is empty', () => {
    reqbody.season = '';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if season is not in enum array', () => {
    reqbody.season = 'NOTINARRAY';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/season/);
  });

  it('should return an error if year is not provided', () => {
    delete reqbody.year;
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if year is not all digits', () => {
    reqbody.year = '202A';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if year is not 4 chars', () => {
    reqbody.year = '123';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if year is empty', () => {
    reqbody.year = '';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if coverImg is not a string', () => {
    reqbody.coverImg = 1;
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if coverImg is not a valid URI', () => {
    reqbody.coverImg = 'a';
    const result = validateCatalog(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateCatalog(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateCoverImage function', () => {
  beforeEach(() => {
    reqbody = {
      coverImg: 'http://image.website.com',
    };
  });

  it('should return an error if coverImg is not provided', () => {
    delete reqbody.coverImg;
    const result = validateCoverImage(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if coverImg is not a string', () => {
    reqbody.coverImg = 1;
    const result = validateCoverImage(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if coverImg is an empty string', () => {
    reqbody.coverImg = '';
    const result = validateCoverImage(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if coverImg is not a valid URI', () => {
    reqbody.coverImg = 'a';
    const result = validateCoverImage(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateCoverImage(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});
