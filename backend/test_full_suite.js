// Comprehensive automated test suite for AI Career Mentor
// Tests: Auth, Aptitude (30 questions), Coding (15 problems & sandbox), Analytics, Profile (CRUD), ML Prediction, and User Isolation.

const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./server');

const TEST_PORT = 5002;
let server;
let baseUrl;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE LOCAL TEST SUITE');
  console.log('====================================================\n');

  // Wait for MongoDB readyState
  console.log('Checking MongoDB connection state...');
  for (let i = 0; i < 20; i++) {
    if (mongoose.connection.readyState === 1) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  assert(mongoose.connection.readyState === 1, 'MongoDB connection is connected (readyState === 1)');

  server = app.listen(TEST_PORT);
  baseUrl = `http://localhost:${TEST_PORT}`;
  console.log(`Test server running at ${baseUrl}\n`);

  const timestamp = Date.now();
  const testUser = {
    name: 'Test Student',
    email: `test_student_${timestamp}@example.com`,
    password: 'Password123!',
  };

  const secondUser = {
    name: 'Second Student',
    email: `second_student_${timestamp}@example.com`,
    password: 'Password123!',
  };

  let token1;
  let token2;

  try {
    // ----------------------------------------------------
    // STEP 1: AUTHENTICATION & SIGNUP HANDLING TESTS
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 1] Signup & Auth Error Handling ---');

    // 1.1 Invalid email format
    const badEmailRes = await request('POST', '/api/auth/register', {
      name: testUser.name,
      email: 'invalid-email-format',
      password: testUser.password,
    });
    assert(badEmailRes.status === 400, 'Invalid email format rejected with 400 Bad Request');

    // 1.2 Missing fields
    const missingRes = await request('POST', '/api/auth/register', {
      email: testUser.email,
    });
    assert(missingRes.status === 400, 'Missing name/password rejected with 400 Bad Request');

    // 1.3 Successful registration
    const registerRes = await request('POST', '/api/auth/register', testUser);
    assert(registerRes.status === 201, 'Valid user registration succeeded with 201 Created');
    assert(registerRes.body.token, 'Registration returns JWT token');
    assert(registerRes.body.user && registerRes.body.user.email === testUser.email, 'User profile returned with email');
    token1 = registerRes.body.token;

    // 1.4 Duplicate email registration
    const duplicateRes = await request('POST', '/api/auth/register', testUser);
    assert(duplicateRes.status === 409, 'Duplicate user registration rejected with 409 Conflict');
    assert(duplicateRes.body.message && (duplicateRes.body.message.includes('already exists') || duplicateRes.body.message.includes('already registered')), 'Duplicate response message explains email already exists');

    // 1.5 Successful login
    const loginRes = await request('POST', '/api/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });
    assert(loginRes.status === 200, 'Login succeeded with 200 OK');
    assert(loginRes.body.token, 'Login returns JWT token');

    // 1.6 Invalid login password
    const badLoginRes = await request('POST', '/api/auth/login', {
      email: testUser.email,
      password: 'WrongPassword!',
    });
    assert(badLoginRes.status === 401, 'Invalid password rejected with 401 Unauthorized');

    // 1.7 Register Second User for Isolation tests later
    const reg2Res = await request('POST', '/api/auth/register', secondUser);
    assert(reg2Res.status === 201, 'Second user registration succeeded');
    token2 = reg2Res.body.token;


    // ----------------------------------------------------
    // STEP 2: APTITUDE PRACTICE TESTS (30 Questions Bank)
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 2] Functional Aptitude Practice ---');

    // 2.1 Fetch questions
    const aptQuestionsRes = await request('GET', '/api/aptitude/questions', null, token1);
    assert(aptQuestionsRes.status === 200, 'GET /api/aptitude/questions returned 200 OK');
    const questions = aptQuestionsRes.body.data;
    assert(Array.isArray(questions), 'Questions payload is an array');
    assert(questions.length === 30, `Aptitude question bank has exactly 30 questions (found: ${questions.length})`);

    const quant = questions.filter((q) => q.category === 'Quantitative');
    const logic = questions.filter((q) => q.category === 'Logical');
    const verbal = questions.filter((q) => q.category === 'Verbal');
    assert(quant.length === 10, `Quantitative questions count is exactly 10 (found: ${quant.length})`);
    assert(logic.length === 10, `Logical Reasoning questions count is exactly 10 (found: ${logic.length})`);
    assert(verbal.length === 10, `Verbal Ability questions count is exactly 10 (found: ${verbal.length})`);

    // 2.2 Security check: Ensure answers and explanations are not leaked
    const hasLeakedAnswer = questions.some((q) => q.correctAnswer !== undefined || q.explanation !== undefined);
    assert(!hasLeakedAnswer, 'CRITICAL: No correctAnswer or explanation leaked in GET questions API');

    // 2.3 Submit aptitude test
    // Create an answer submission array: select options for first 5 questions
    const answersToSubmit = questions.slice(0, 5).map((q) => ({
      questionId: q.id,
      selectedAnswer: q.options[0],
    }));

    const submitAptRes = await request(
      'POST',
      '/api/aptitude/submit',
      {
        answers: answersToSubmit,
      },
      token1
    );

    assert(submitAptRes.status === 200, 'POST /api/aptitude/submit returned 200 OK');
    const submitData = submitAptRes.body.data || submitAptRes.body;
    assert(submitData.score !== undefined, 'Submission returned score');
    assert(submitData.results && submitData.results.length === 5, 'Submission returned 5 detailed question results with explanations');
    assert(submitData.results[0].explanation, 'Explanations are provided after submission');

    // 2.4 Verify Aptitude Stats API
    const aptStatsRes = await request('GET', '/api/aptitude/stats', null, token1);
    assert(aptStatsRes.status === 200, 'GET /api/aptitude/stats returned 200 OK');
    const aptStatsData = aptStatsRes.body.data || aptStatsRes.body.stats;
    assert(aptStatsData.testsCompleted >= 1, 'Stats reflect at least 1 completed test');
    assert(aptStatsData.totalQuestions >= 5, 'Stats reflect at least 5 attempted questions');

    // 2.5 Verify Aptitude History API
    const aptHistoryRes = await request('GET', '/api/aptitude/history', null, token1);
    assert(aptHistoryRes.status === 200, 'GET /api/aptitude/history returned 200 OK');
    const aptHistoryData = aptHistoryRes.body.data || aptHistoryRes.body.history;
    assert(Array.isArray(aptHistoryData) && aptHistoryData.length >= 1, 'Attempt history recorded in MongoDB');


    // ----------------------------------------------------
    // STEP 3: CODING PRACTICE TESTS (15 Problems Bank & Sandbox)
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 3] Functional Coding Practice ---');

    // 3.1 Fetch problems
    const codingProblemsRes = await request('GET', '/api/coding/problems', null, token1);
    assert(codingProblemsRes.status === 200, 'GET /api/coding/problems returned 200 OK');
    const problems = codingProblemsRes.body.data || codingProblemsRes.body.problems;
    assert(Array.isArray(problems), 'Coding problems payload is an array');
    assert(problems.length === 15, `Coding problem bank has exactly 15 problems (found: ${problems.length})`);

    const easy = problems.filter((p) => p.difficulty === 'Easy');
    const medium = problems.filter((p) => p.difficulty === 'Medium');
    const hard = problems.filter((p) => p.difficulty === 'Hard');
    assert(easy.length === 5, `Easy coding problems count is 5 (found: ${easy.length})`);
    assert(medium.length === 7, `Medium coding problems count is 7 (found: ${medium.length})`);
    assert(hard.length === 3, `Hard coding problems count is 3 (found: ${hard.length})`);

    // Verify covered topics: Arrays, Strings, Searching, Sorting, Linked Lists, Stacks, Queues
    const topics = new Set(problems.map((p) => p.topic));
    const expectedTopics = ['Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Stacks', 'Queues'];
    for (const t of expectedTopics) {
      assert(topics.has(t), `Covered required topic: ${t}`);
    }

    // 3.2 Test code evaluation with correct solution for "two-sum"
    const twoSumCorrectCode = `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
            return [map.get(complement), i];
          }
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const twoSumAttemptRes = await request(
      'POST',
      '/api/coding/attempt',
      {
        problemId: problems[0].id,
        code: twoSumCorrectCode,
        language: 'javascript',
      },
      token1
    );

    assert(twoSumAttemptRes.status === 200 || twoSumAttemptRes.status === 201, 'POST /api/coding/attempt returned 200/201 OK');
    const twoSumResult = twoSumAttemptRes.body.data || twoSumAttemptRes.body;
    assert(twoSumResult.passed === true, 'Solution evaluated as passed: true');
    assert(twoSumResult.testResults && twoSumResult.testResults.every((t) => t.passed), 'All test cases passed');

    // 3.3 Test code evaluation with incorrect solution
    const twoSumWrongCode = `
      function twoSum(nums, target) {
        return [0, 0];
      }
    `;

    const wrongAttemptRes = await request(
      'POST',
      '/api/coding/attempt',
      {
        problemId: problems[0].id,
        code: twoSumWrongCode,
        language: 'javascript',
      },
      token1
    );

    assert(wrongAttemptRes.status === 200 || wrongAttemptRes.status === 201, 'Wrong submission evaluated safely without crashing');
    const wrongResult = wrongAttemptRes.body.data || wrongAttemptRes.body;
    assert(wrongResult.passed === false, 'Incorrect solution marked as passed: false');

    // 3.4 Verify Coding Stats & History
    const codingStatsRes = await request('GET', '/api/coding/stats', null, token1);
    assert(codingStatsRes.status === 200, 'GET /api/coding/stats returned 200 OK');
    assert(codingStatsRes.body.data.problemsSolved >= 1, 'Stats reflect at least 1 solved problem');

    const codingHistoryRes = await request('GET', '/api/coding/history', null, token1);
    assert(codingHistoryRes.status === 200, 'GET /api/coding/history returned 200 OK');
    assert(codingHistoryRes.body.data.length >= 2, 'Coding history recorded in MongoDB');


    // ----------------------------------------------------
    // STEP 4: ANALYTICS & EMPTY STATE FOR NEW STUDENTS
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 4] Progress Analytics & Student Isolation ---');

    // User 1 has stats
    const u1Apt = await request('GET', '/api/aptitude/stats', null, token1);
    const u1Cod = await request('GET', '/api/coding/stats', null, token1);
    assert(u1Apt.body.data.testsCompleted > 0, 'User 1 has completed aptitude tests');
    assert(u1Cod.body.data.problemsSolved > 0, 'User 1 has solved coding problems');

    // User 2 (fresh student) should see genuine empty state
    const u2Apt = await request('GET', '/api/aptitude/stats', null, token2);
    const u2Cod = await request('GET', '/api/coding/stats', null, token2);
    assert(u2Apt.body.data.testsCompleted === 0, 'User 2 sees 0 aptitude tests completed (clean empty state)');
    assert(u2Apt.body.data.totalQuestions === 0, 'User 2 sees 0 questions attempted');
    assert(u2Cod.body.data.problemsSolved === 0, 'User 2 sees 0 coding problems solved (clean empty state)');
    assert(u2Cod.body.data.problemsAttempted === 0, 'User 2 sees 0 coding problems attempted');

    // User 2 should NOT see User 1's history
    const u2AptHistory = await request('GET', '/api/aptitude/history', null, token2);
    assert(u2AptHistory.body.data.length === 0, 'User 2 sees empty aptitude history (proper user isolation)');


    // ----------------------------------------------------
    // STEP 5: PROFILE EDIT & DELETE CRUD OPERATIONS
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 5] Profile Add, Edit, Delete CRUD Operations ---');

    // 5.1 Add Project
    const addProjRes = await request(
      'POST',
      '/api/projects',
      {
        title: 'AI Career Mentor Project',
        description: 'Comprehensive career guidance and placement readiness platform',
        techStack: 'React, Node.js, Express, MongoDB, Machine Learning',
        githubLink: 'https://github.com/example/career-mentor',
        liveLink: 'https://mentor.example.com',
      },
      token1
    );
    assert(addProjRes.status === 201, 'POST /api/projects created project successfully');
    const createdProjectId = addProjRes.body._id;
    assert(createdProjectId, 'Created project returned with MongoDB _id');

    // 5.2 Edit Project
    const editProjRes = await request(
      'PUT',
      `/api/projects/${createdProjectId}`,
      {
        title: 'AI Career Mentor Project - UPDATED',
        description: 'Updated description for the career platform',
        techStack: 'React, Node, Express, MongoDB',
      },
      token1
    );
    assert(editProjRes.status === 200, 'PUT /api/projects/:id updated project successfully');
    const updatedProj = editProjRes.body.project || editProjRes.body;
    assert(updatedProj.name === 'AI Career Mentor Project - UPDATED' || updatedProj.title === 'AI Career Mentor Project - UPDATED', 'Updated title reflected in response');

    // 5.3 Verify Project in GET /api/projects
    const getProjRes = await request('GET', '/api/projects', null, token1);
    assert(getProjRes.status === 200, 'GET /api/projects returned 200 OK');
    const projectList = getProjRes.body.projects || getProjRes.body.data || (Array.isArray(getProjRes.body) ? getProjRes.body : []);
    const foundProj = projectList.find((p) => String(p._id) === String(createdProjectId));
    assert(foundProj && (foundProj.name === 'AI Career Mentor Project - UPDATED' || foundProj.title === 'AI Career Mentor Project - UPDATED'), 'Project persisted in MongoDB with update');

    // 5.4 Delete Project
    const delProjRes = await request('DELETE', `/api/projects/${createdProjectId}`, null, token1);
    assert(delProjRes.status === 200, 'DELETE /api/projects/:id deleted project successfully');

    // 5.5 Verify Project is removed
    const getProjAfterDel = await request('GET', '/api/projects', null, token1);
    const listAfterDel = getProjAfterDel.body.projects || getProjAfterDel.body.data || (Array.isArray(getProjAfterDel.body) ? getProjAfterDel.body : []);
    const deletedProjCheck = listAfterDel.find((p) => String(p._id) === String(createdProjectId));
    assert(!deletedProjCheck, 'Project is permanently removed from user projects');


    // ----------------------------------------------------
    // STEP 6: ML PREDICTION PIPELINE VERIFICATION
    // ----------------------------------------------------
    console.log('\n--- [TEST SUITE 6] ML Placement Prediction Pipeline ---');

    const mlPredictRes = await request(
      'POST',
      '/api/prediction/predict',
      {
        cgpa: 8.5,
        backlogs: 0,
        coding: 80,
        sql: 75,
        aptitude: 85,
        communication: 80,
        projects: 3,
        certifications: 2,
        internships: 1,
      },
      token1
    );

    assert(mlPredictRes.status === 200, 'POST /api/prediction/predict returned 200 OK');
    assert(mlPredictRes.body.success === true, 'ML prediction returned success: true');
    assert(typeof mlPredictRes.body.score === 'number', `ML predicted score returned: ${mlPredictRes.body.score}`);
    assert(mlPredictRes.body.label !== undefined, `ML predicted label: ${mlPredictRes.body.label}`);
    assert(mlPredictRes.body.packageBand !== undefined, `ML package band: ${mlPredictRes.body.packageBand}`);


    console.log('\n====================================================');
    console.log('🎉 ALL INTEGRATION AND UNIT TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    // Disconnect mongoose
    await mongoose.disconnect();
    console.log('Test server closed and DB disconnected.');
  }
}

runTests();
