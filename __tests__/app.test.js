const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  it("200: returns an array of categories", async () => {
    const {
      body: { categories },
    } = await request(app).get("/api/categories").expect(200);
    expect(categories).toHaveLength(4);
    expect(categories).toBeInstanceOf(Array);
  });
  it("200: objects in array contains slug and description", async () => {
    const {
      body: { categories },
    } = await request(app).get("/api/categories").expect(200);
    categories.forEach((category) => {
      expect(category).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
  it("404: returns a page not found error when path is misspelt", async () => {
    const { statusCode } = await request(app)
      .get("/api/categoriez")
      .expect(404);
    expect(statusCode).toBe(404);
  });
});

describe("GET /api/reviews/:review_id", () => {
  it('200: returns an object with "review" key and value of array', async () => {
    const {
      body: { review },
    } = await request(app).get("/api/reviews/2").expect(200);
    expect(review).toBeInstanceOf(Array);
  });
  it("200: object in array contains owner, title, review_id, review_body, designer, review_img_url, category, created_at, votes, comment_count", async () => {
    const {
      body: { review },
    } = await request(app).get("/api/reviews/2").expect(200);
    expect(review).toHaveLength(1);
    expect(review[0]).toEqual(
      expect.objectContaining({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      })
    );
  });
  it("400: returns 'Bad request.' when entered a wrong id data type", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/reviews/banana").expect(400);
    expect(msg).toBe("Bad request.");
  });
  it("404: returns 'ID does not exist' when id doesn't exist", async () => {
    const { body } = await request(app).get("/api/reviews/55").expect(404);
    expect(body.msg).toBe("ID does not exist.");
  });
});
