// ── Lab Data (extracted from Labguide.html) ──────────────────────────────────

export const BADGES = [
  { id: 'novice', name: 'Novice Prompter', xp: 80, icon: '⚡', bg: 'rgba(0,212,170,.12)', c: '#00D4AA', title: '"First spark ignited"', desc: 'Complete your first lab' },
  { id: 'builder', name: 'TaskFlow Builder', xp: 310, icon: '🔧', bg: 'rgba(59,130,246,.12)', c: '#3B82F6', title: '"Foundation laid"', desc: 'Labs 01–03 done' },
  { id: 'engineer', name: 'Claude Engineer', xp: 620, icon: '⚙', bg: 'rgba(168,85,247,.12)', c: '#A855F7', title: '"Backend forged"', desc: 'Labs 01–06 done' },
  { id: 'architect', name: 'AI Architect', xp: 1150, icon: '🏛', bg: 'rgba(245,200,66,.12)', c: '#F5C842', title: '"Fullstack AI Master"', desc: 'Labs 01–09 done' },
  { id: 'master', name: 'ADLC Master', xp: 1450, icon: '🚀', bg: 'rgba(255,107,53,.12)', c: '#FF6B35', title: '"Ship it. You earned it."', desc: 'All 10 labs done' },
];

export const SMETA = { easy: 'Easy Sprint', hard: 'Hard Sprint', boss: 'Boss Sprint', final: 'Capstone' };
export const SCLASS = { easy: 'sb-easy d-easy', hard: 'sb-hard d-hard', boss: 'sb-boss d-boss', final: 'sb-final d-final' };
export const SICON = { easy: '◎', hard: '◈', boss: '⬡', final: '★' };

export const LABS = [
  {
    id: 1, title: 'Ideation & Requirements', sprint: 'easy', base: 80, dur: '45 min',
    product: 'Claude Code', objective: 'Master AI-driven ideation and PRD generation.',
    stack: 'Claude Code · Markdown · PRD',
    feats: ['Role Prompting', 'Constraint Injection', 'Iterative Refinement', 'Long-Context Reasoning'],
    pre: {
      type: 'mcq', title: 'What do you already know about Claude Code?',
      qs: [
        { q: 'Claude Code is primarily designed for:', opts: ['Casual chat', 'Agentic CLI coding assistant', 'Browser automation', 'Data analysis'], a: 1 },
        { q: 'In Gherkin format, the three keywords are:', opts: ['If/Else/Return', 'Setup/Run/Assert', 'Given/When/Then', 'Start/Do/End'], a: 2 },
        { q: 'Which MoSCoW label means "nice to have but not essential"?', opts: ['Must Have', 'Should Have', 'Could Have', "Won't Have"], a: 2 },
        { q: 'The ADLC approach embeds AI at:', opts: ['Only the coding phase', 'Only testing', 'Every SDLC phase', 'Only deployment'], a: 2 },
        { q: 'Constraint injection means:', opts: ['Adding unit tests', 'Injecting requirements mid-conversation', 'Dependency injection in code', 'SQL injection prevention'], a: 1 },
      ]
    },
    post: {
      type: 'reflection', title: 'Reflect on your PRD quality',
      qs: [
        'How confident are you that a developer could build from your PRD without clarifying questions? Rate 1–5 and explain why.',
        'Which Gherkin story was hardest to write? What made it difficult?',
        'How did using a role prompt ("You are a senior PM...") change the output quality?'
      ]
    },
    bonus: {
      cmd: 'claude "You are a startup CTO. Review the PRD at docs/PRD.md and identify the 3 biggest technical feasibility risks. For each risk, suggest a mitigation strategy and any PRD changes needed."',
      mission: 'Run the command above. Review Claude\'s concerns. Add 2 new user stories that address them. Save the updated PRD. +30 XP'
    },
    exs: [
      { id: '1A', title: 'Generate the PRD', desc: 'Transform a one-line brief into a full Product Requirements Document with Gherkin user stories.', cmd: 'claude "You are a senior product manager. Brief: \'Task management app for remote engineering teams with real-time collaboration, role-based access, deadline tracking.\' Generate a PRD in Markdown: 20 user stories (Gherkin Given/When/Then), 3 acceptance criteria each, 2 edge cases each. Markdown only, no preamble. Save as docs/PRD.md"' },
      { id: '1B', title: 'Constraint Injection', desc: 'Refine the PRD with GDPR, performance, and rate-limiting constraints.', cmd: 'claude "Revise docs/PRD.md adding: GDPR Article 17 cascade deletes, FastAPI p99 < 200ms, offline service-worker mode, rate limit 100 req/min per user. For each constraint flag every story impacted and how. Save updated PRD."' },
      { id: '1C', title: 'MoSCoW Prioritisation', desc: 'Produce a sprint-ready backlog with FastAPI endpoint hints.', cmd: 'claude "Create a MoSCoW backlog from docs/PRD.md. Table columns: Story ID | Title | Priority | Story Points (Fibonacci) | FastAPI Endpoint Hint. Sort Must-first. Save as docs/BACKLOG.md"' },
    ],
    checklist: ['PRD generated with 20+ Gherkin user stories', 'Each story has 3 acceptance criteria and 2 edge cases', 'GDPR and performance constraints reflected', 'MoSCoW backlog with FastAPI endpoint hints saved', 'Files saved in taskflow/docs/'],
  },
  {
    id: 2, title: 'System Architecture', sprint: 'hard', base: 150, dur: '60 min',
    product: 'Claude Code', objective: 'Design microservices and generate async ORM models.',
    expectedOutputImage: '/assets/validation/lab2_structure.png',
    stack: 'SQLAlchemy 2.0 · Alembic · OpenAPI',
    feats: ['Structured Output', 'Justification Prompting', 'Code Generation', 'SQL DDL Generation', 'OpenAPI Spec'],
    pre: {
      type: 'match', title: 'Match the architecture concepts',
      pairs: [
        ['SQLAlchemy Mapped[]', 'Async ORM column declaration'],
        ['Alembic', 'Database migration tool'],
        ['Pydantic v2', 'Request/response validation'],
        ['FastAPI Depends()', 'Dependency injection pattern'],
        ['OpenAPI 3.0', 'API contract specification'],
        ['asyncpg', 'Async PostgreSQL driver'],
      ]
    },
    post: {
      type: 'output', title: 'Verify your migration and models work',
      steps: [
        'alembic upgrade head  →  expect: Running upgrade -> [rev] OK',
        'python -c "from app.models import Task, User; print(\'Models OK\')"',
        'curl http://localhost:8000/openapi.json | python -m json.tool  →  expect valid JSON',
        'Check that Task, User, Team, Comment, Notification tables exist in the DB'
      ]
    },
    bonus: {
      cmd: 'claude "Review all SQLAlchemy models in app/models/. Identify any missing database indexes that would cause slow queries at 1 million+ task rows. Add the indexes with a comment explaining which query each one optimises."',
      mission: 'Count how many indexes Claude adds. For each one, write a one-line SQL EXPLAIN comment in the migration file. +30 XP'
    },
    exs: [
      { id: '2A', title: 'Microservices Design', desc: 'Claude Code designs the 3-service FastAPI architecture with justified technology choices.', cmd: 'claude "Design a 3-service FastAPI microservices architecture for TaskFlow using docs/PRD.md. Per service: async router signatures, Pydantic v2 schemas, inter-service communication pattern (REST vs Redis pub/sub), Python libraries with justification. Save as docs/ARCHITECTURE.md"' },
      { id: '2B', title: 'SQLAlchemy Models', desc: 'Generate async SQLAlchemy 2.0 models with GDPR cascade rules and performance indexes.', cmd: 'claude "Generate SQLAlchemy 2.0 async Mapped[] models for: User, Team, Task, Comment, Notification. Include: GDPR ondelete=SET NULL, indexes for common query patterns, Python enums for TaskStatus/Priority/UserRole, Alembic migration script. Save models to app/models/ and migration to migrations/"' },
      { id: '2C', title: 'OpenAPI Specification', desc: 'Produce the API contract that frontend and tests will both target.', cmd: 'claude "Generate complete OpenAPI 3.0 YAML for the Task Service: all CRUD endpoints, JWT Bearer auth scheme, cursor pagination, Pydantic error schemas, 3 examples per endpoint. Validate it parses correctly. Save as docs/openapi.yaml"' },
    ],
    checklist: ['3-service architecture documented with justification', 'SQLAlchemy 2.0 Mapped[] models for all 5 entities', 'Alembic migration runs without errors', 'OpenAPI 3.0 YAML validates correctly', 'Files in taskflow/app/models/ and taskflow/docs/'],
  },
  {
    id: 3, title: 'Frontend Development', sprint: 'easy', base: 80, dur: '75 min',
    product: 'Claude Code', objective: 'Build accessible UIs with components and HTMX.',
    expectedOutputImage: '/assets/validation/lab3_kanban.png',
    stack: 'Jinja2 · HTMX · Tailwind CSS',
    feats: ['Component Generation', 'Accessibility Audit', 'WCAG Fix Generation', 'HTMX Patterns', 'Multi-Turn Refinement'],
    pre: {
      type: 'bug', title: 'Spot the 3 bugs in this Jinja2 template',
      lines: ['{% extends "base.html" %}', '{% block content %}', '<div class="task-card">', '  <img src="{{ task.avatar }}" />', '  <h3>{{ task.title }}</h3>', '  <span style="color:red">OVERDUE</span>', '  <button hx-post="/tasks/{{ task.id }}/done">', '    Mark Done', '  </button>', '</div>', '{% endblock %}'],
      bugs: [3, 5, 6],
      explains: [
        'Line 4 — img missing alt attribute: WCAG 1.1.1 failure, screen readers cannot describe the image',
        'Line 6 — inline style colour: insufficient contrast ratio, not theme-aware, fails WCAG 1.4.3',
        'Line 7 — HTMX button missing hx-swap and hx-target: the partial response has nowhere to render'
      ]
    },
    post: {
      type: 'mini', title: '10-minute timed challenge: add dark mode', secs: 600,
      task: 'Add Tailwind dark: prefix variants to your TaskCard template so it renders correctly in both light and dark mode. Include the dark mode toggle button in base.html that sets class="dark" on <html>.',
      criteria: ['dark: class prefix used on at least 3 elements', 'Toggle button updates <html class="dark">', 'No inline styles introduced', 'Template renders without Jinja2 errors']
    },
    bonus: {
      cmd: 'claude "Run a WCAG 2.1 AA accessibility audit on all HTML templates in the templates/ directory. List every violation: WCAG rule ID, severity (Critical/Major/Minor), user impact, and a corrected Jinja2 code snippet. Then automatically fix all Critical violations."',
      mission: 'Run the audit. Verify Claude fixes every Critical violation. Re-run and confirm zero Critical issues remain. +30 XP'
    },
    exs: [
      { id: '3A', title: 'TaskCard Component', desc: 'Generate the Jinja2 TaskCard with HTMX status toggle and Tailwind styling.', cmd: 'claude "Generate a Jinja2 TaskCard template: title, assignee avatar (with alt text), priority badge (colour-coded High/Medium/Low), due date (red class if overdue), HTMX hx-patch toggle button with hx-swap and hx-target. Tailwind CSS classes. Include the FastAPI HTMLResponse route."' },
      { id: '3B', title: 'HTMX Kanban Board', desc: 'Build the Kanban board with out-of-band HTMX column count updates.', cmd: 'claude "Generate a Jinja2 Kanban board: 3 columns (To Do, In Progress, Done). Cards use hx-post to move columns with hx-swap=outerHTML and hx-target OOB for column count update. Include the FastAPI partial HTML endpoint that handles column moves."' },
      { id: '3C', title: 'WCAG Accessibility Audit', desc: 'Claude Code reviews every template and auto-fixes Critical violations.', cmd: 'claude "WCAG 2.1 AA audit of templates/ directory. For each violation: rule ID, severity, screen-reader impact, fixed Jinja2 code. Automatically apply fixes for all Critical issues and report what was changed."' },
    ],
    checklist: ['TaskCard with HTMX toggle renders correctly', 'Kanban board with OOB column count update working', 'WCAG audit completed, zero Critical violations', 'Dark mode toggle added to base.html', 'Templates saved in taskflow/templates/'],
  },
  {
    id: 4, title: 'Backend with FastAPI', sprint: 'hard', base: 160, dur: '90 min',
    product: 'Claude Code', objective: 'Develop secure JWT-auth backends and WebSockets.',
    expectedOutputImage: '/assets/validation/lab4_swagger.png',
    stack: 'FastAPI · JWT · WebSocket · slowapi',
    feats: ['Code Generation', 'Security Review (OWASP)', 'JWT Auth Design', 'WebSocket Pattern', 'Agentic Refactoring', 'Dependency Injection'],
    pre: {
      type: 'fillin', title: 'Complete the FastAPI route skeleton',
      lines: [
        { t: '@router.get("/", response_model=', b: 'TaskListResponse', h: 'Pydantic response model name', a: ')' },
        { t: 'async def list_tasks(db: ', b: 'AsyncSession', h: 'SQLAlchemy async session type', a: ' = Depends(get_async_db),' },
        { t: '    current_user: User = Depends(', b: 'get_current_active_user', h: 'Auth dependency function name', a: '),' },
        { t: '    cursor: ', b: 'str | None', h: 'Optional string type (Python 3.10+)', a: ' = Query(None)):' },
      ]
    },
    post: {
      type: 'output', title: 'Verify your API endpoints respond correctly',
      steps: [
        'curl -X POST localhost:8000/auth/register -H "Content-Type: application/json" -d \'{"email":"t@t.com","password":"Test123!"}\' → expect 201',
        'curl -X POST localhost:8000/auth/login ... → copy the access_token',
        'curl -H "Authorization: Bearer <token>" localhost:8000/api/v1/tasks → expect 200 {"items":[]}',
        'curl -X POST localhost:8000/api/v1/tasks -H "Authorization: Bearer <token>" -d \'{"title":"Test"}\' → expect 201'
      ]
    },
    bonus: {
      cmd: 'claude "Run an OWASP Top 10 security review of app/routers/ and app/auth/. For each vulnerability: name, severity (Critical/High/Medium/Low), attack vector in FastAPI context, and a patched code snippet. Automatically fix all Critical and High severity issues."',
      mission: 'Apply all fixes. Re-run the review and confirm zero Critical/High findings. Document each fix in a SECURITY.md file. +30 XP'
    },
    exs: [
      { id: '4A', title: 'Async CRUD Router', desc: 'Full FastAPI async task router with cursor pagination, filtering, soft delete.', cmd: 'claude "Generate complete FastAPI async /api/v1/tasks router: GET with cursor pagination and status/priority/assignee filters, POST with Pydantic v2 validation returning 201, PATCH partial update, DELETE soft-delete with GDPR cascade. Use AsyncSession via Depends(get_async_db). Raise 403/404 with HTTPException."' },
      { id: '4B', title: 'JWT Auth + Refresh Tokens', desc: 'Access + refresh tokens with Redis blacklist and HTTPOnly cookies.', cmd: 'claude "Implement FastAPI JWT auth: POST /auth/register and /auth/login, access token 15min + refresh token 7 days with rotation, HTTPOnly cookie delivery, Redis token blacklist on logout, get_current_active_user Depends() for route protection. Use python-jose and passlib[bcrypt]."' },
      { id: '4C', title: 'OWASP Security Review', desc: 'Claude Code audits and auto-patches all Critical/High security issues.', cmd: 'claude "OWASP Top 10 review of app/ directory. Per vulnerability: name, severity, FastAPI-specific attack vector, patched code. Add slowapi rate limiting, CORS lockdown with allowed origins, SQLAlchemy parameterised queries. Fix all Critical and High issues automatically."' },
      { id: '4D', title: 'WebSocket Real-Time', desc: 'Team room broadcast with Redis pub/sub and user presence tracking.', cmd: 'claude "Add FastAPI WebSocket endpoint GET /ws/tasks/{team_id}: ConnectionManager for team rooms, broadcast JSON on task create/update/delete, user presence (online/away/offline) in Redis, reconnect with exponential backoff in vanilla JS. Handle disconnect gracefully."' },
    ],
    checklist: ['Async CRUD router with cursor pagination working', 'JWT auth with refresh token rotation and Redis blacklist', 'OWASP review done — zero Critical/High issues remaining', 'WebSocket broadcast working for team rooms', 'Rate limiting and CORS configured'],
  },
  {
    id: 5, title: 'Testing with Pytest', sprint: 'easy', base: 90, dur: '60 min',
    product: 'Claude Code', objective: 'Implement async integration tests and coverage gates.',
    stack: 'Pytest · HTTPX · pytest-cov · Playwright',
    feats: ['Test Generation', 'Coverage Gap Analysis', 'Edge Case Discovery', 'Fixture Generation', 'Parametrize Pattern'],
    pre: {
      type: 'bug', title: 'Why will this test always pass — even when the code is broken?',
      lines: ['import pytest', '', '@pytest.mark.asyncio', 'async def test_create_task(async_client):', '    resp = await async_client.post("/api/v1/tasks",', '        json={"title": "My task"})', '    data = resp.json()', '    assert data is not None', '    assert "id" in data', '    print("Task created:", data)'],
      bugs: [7, 8],
      explains: [
        'Line 8 — No status code check: a 422 validation error or 500 server error also returns JSON with a body, so assert data is not None passes even on failure',
        'Line 9 — assert "id" in data passes for {"detail":"Not authenticated"} too, since it just checks key existence not that the value is a real UUID from a created task'
      ]
    },
    post: {
      type: 'output', title: 'Verify your coverage gate passes',
      steps: [
        'pytest --asyncio-mode=auto --cov=app --cov-report=term-missing',
        'Confirm overall coverage line shows: TOTAL ... XX%  →  must be >= 80%',
        'Identify the 2 files with lowest coverage from the report',
        'Run: claude "Generate Pytest tests to bring coverage of [filename] to 90%+" and re-run'
      ]
    },
    bonus: {
      cmd: 'claude "Analyse the coverage report at coverage.xml. Find the 5 highest-risk uncovered code paths in app/. For each path: risk rating (Critical/High/Medium), why it is risky in async FastAPI, and a complete Pytest test that exercises it."',
      mission: 'Implement all 5 tests Claude generates. Temporarily break each implementation to confirm the test catches the failure. +30 XP'
    },
    exs: [
      { id: '5A', title: 'conftest.py + Fixtures', desc: 'Full async test setup: HTTPX client, SQLite isolation, Factory Boy, auth headers.', cmd: 'claude "Generate conftest.py for async FastAPI testing: async_engine with SQLite aiosqlite in-memory, async_db AsyncSession with rollback after each test, async_client HTTPX with FastAPI dependency override, UserFactory and TaskFactory via Factory Boy, auth_headers fixture returning Bearer token dict."' },
      { id: '5B', title: 'Integration Tests', desc: 'Full CRUD coverage with auth scenarios, validation, and pagination edge cases.', cmd: 'claude "Write pytest async integration tests for /api/v1/tasks: all CRUD happy paths with status code assertions, auth scenarios (missing/expired/wrong-scope token), 422 Pydantic validation errors, cursor pagination first/last/empty page, concurrent PATCH optimistic lock. Use @pytest.mark.parametrize for auth scenarios."' },
      { id: '5C', title: 'Coverage Gap Analysis', desc: 'Feed the coverage report to Claude Code and generate the missing high-risk tests.', cmd: 'claude "Read coverage.xml. Identify the 5 highest-risk uncovered code paths. Per path: risk rating, async FastAPI context, complete Pytest test. Prioritise auth middleware paths and DB transaction rollback handlers."' },
    ],
    checklist: ['conftest.py with async fixtures and Factory Boy factories', 'Integration tests for all CRUD endpoints (80%+ coverage)', 'Coverage gap analysis done, missing tests added', 'Playwright E2E happy path test passing', 'Tests saved in taskflow/tests/'],
  },
  {
    id: 6, title: 'AI-Powered Code Review', sprint: 'hard', base: 150, dur: '45 min',
    product: 'Claude Code', objective: 'Perform AI-driven code reviews and bug hunting.',
    stack: 'Ruff · mypy · Claude Code review',
    feats: ['Bug Detection', 'Performance Analysis', 'SOLID Review', 'Anti-Pattern ID', 'Async Python Review', 'Pydantic Type Safety'],
    pre: {
      type: 'mcq', title: 'OWASP and Python async security check',
      qs: [
        { q: 'A FastAPI route does: db.query(User).filter(User.email == email). What OWASP risk if email is not validated?', opts: ['A02 Cryptographic Failures', 'A03 Injection', 'A07 Auth Failures', 'A09 Logging Failures'], a: 1 },
        { q: 'What causes N+1 queries in SQLAlchemy?', opts: ['Using selectinload()', 'Accessing lazy-loaded relationships in a loop', 'Using joinedload()', 'Using limit()'], a: 1 },
        { q: 'A Pydantic schema returns password_hash in a response model. Which OWASP risk?', opts: ['A01 Broken Access Control', 'A02 Cryptographic Failures', 'A03 Injection', 'A05 Misconfiguration'], a: 0 },
        { q: 'An async FastAPI handler calls time.sleep(5). What is the problem?', opts: ['Minor style issue only', 'Blocks the entire asyncio event loop', 'Only works on Python 3.12+', 'Causes a memory leak'], a: 1 },
        { q: 'Which ruff command auto-fixes all fixable linting issues?', opts: ['ruff check .', 'ruff fix .', 'ruff check --fix .', 'ruff format .'], a: 2 },
      ]
    },
    post: {
      type: 'reflection', title: 'Code review retrospective',
      qs: [
        'Rate your code quality before this lab vs after Claude\'s review (1–5 each). What was the single biggest surprise finding?',
        'Which bug category was hardest to spot manually: async pitfalls, N+1 queries, or type safety? Why?',
        'What one coding habit will you change permanently as a result of this lab?'
      ]
    },
    bonus: {
      cmd: 'claude "Run ruff check app/ and mypy app/ --strict. For every error found: explain WHY it matters in a production FastAPI service (not just what the rule says). Then fix all errors automatically."',
      mission: 'Record the error counts before and after. Write a 3-sentence summary of the most important things you learned from the linter output. +30 XP'
    },
    exs: [
      { id: '6A', title: 'Async Bug Detection', desc: 'Claude Code hunts for missing awaits, N+1 queries, exception swallowing, race conditions.', cmd: 'claude "Senior FastAPI code review of app/routers/tasks.py: find missing await on coroutines, N+1 SQLAlchemy lazy-load patterns, exception handlers that swallow errors silently, concurrent state mutation risks, connection pool exhaustion. Provide severity rating and fixed code for each issue."' },
      { id: '6B', title: 'SQLAlchemy Performance', desc: 'Optimise queries with eager loading, indexes, and proper async patterns.', cmd: 'claude "Review SQLAlchemy queries in app/services/. Find: missing selectinload/joinedload causing N+1 queries, full table scans on unindexed columns, missing pagination on unbounded queries, synchronous calls inside async functions. Provide optimised query with explain-plan comments."' },
      { id: '6C', title: 'Pydantic Type Safety', desc: 'Find response models leaking internal fields and missing validators.', cmd: 'claude "Review Pydantic models in app/schemas/. Find: response models exposing password_hash or internal IDs, missing field_validator for email/enum types, unsafe use of Any type, missing model_config settings. Provide corrected Pydantic v2 models."' },
    ],
    checklist: ['Async bug review done on all route handlers', 'SQLAlchemy N+1 queries identified and fixed with eager loading', 'Pydantic models audited — no internal fields exposed', 'ruff check and mypy --strict both pass with zero errors', 'Review notes saved in taskflow/reviews/'],
  },
  {
    id: 7, title: 'Documentation', sprint: 'easy', base: 80, dur: '45 min',
    product: 'Claude Code', objective: 'Automate documentation with Docstrings and ADRs.',
    stack: 'Sphinx · Google docstrings · ADR',
    feats: ['Docstring Generation', 'Technical Writing', 'ADR Drafting', 'README Generation', 'Sphinx autodoc'],
    pre: {
      type: 'fillin', title: 'Fix the incomplete Google-style docstring',
      lines: [
        { t: 'def create_task(title: str, priority: str) -> Task:', b: '', h: '', a: '' },
        { t: '    """Create a new task in the database.', b: '', h: '', a: '' },
        { t: '    ', b: 'Args', h: 'Google docstring section for parameters', a: ':' },
        { t: '        title (str): The task title, max 255 chars.', b: '', h: '', a: '' },
        { t: '        priority (', b: 'str', h: 'Type annotation for priority param', a: '): low, medium, or high.' },
        { t: '    ', b: 'Returns', h: 'Google section for the return value', a: ':' },
        { t: '        Task: The newly created SQLAlchemy Task object.', b: '', h: '', a: '' },
        { t: '    ', b: 'Raises', h: 'Google section for exceptions raised', a: ':' },
        { t: '        ValueError: If priority is not a valid value.', b: '', h: '', a: '' },
        { t: '    """', b: '', h: '', a: '' },
      ]
    },
    post: {
      type: 'output', title: 'Verify Sphinx builds without warnings',
      steps: [
        'cd docs && sphinx-build -b html . _build/html',
        'Confirm: "build succeeded" with 0 warnings',
        'Open _build/html/index.html — verify module autodocs render',
        'Confirm at least 3 modules appear in the API reference section'
      ]
    },
    bonus: {
      cmd: 'claude "Generate a CHANGELOG.md for the TaskFlow project based on git log output. Follow Keep a Changelog format (https://keepachangelog.com). Group by Added/Changed/Fixed/Security. Add an [Unreleased] section."',
      mission: 'Generate the CHANGELOG. Add at least 3 [Unreleased] entries from features you built in Labs 1–6. Commit everything with a conventional commit message (feat:/fix:/docs:). +30 XP'
    },
    exs: [
      { id: '7A', title: 'Google-Style Docstrings', desc: 'Claude Code adds complete docstrings to all router and service files.', cmd: 'claude "Add Google-style docstrings to every public function in app/routers/ and app/services/. Include: one-line summary, Args section with types and descriptions, Returns section, Raises for all HTTPException cases, and a realistic Example showing an HTTPX test call with expected response."' },
      { id: '7B', title: 'Architecture Decision Record', desc: 'Document the FastAPI technology choice for future engineers.', cmd: 'claude "Write an ADR using the MADR template for the decision to use FastAPI over Django REST Framework for TaskFlow. Sections: title, status (Accepted), context, decision, consequences (positive/negative/neutral). Detailed enough for a Python developer onboarding on Day 1. Save as docs/adr/0001-fastapi-over-drf.md"' },
      { id: '7C', title: 'README Generation', desc: 'Professional project README with all standard sections.', cmd: 'claude "Generate README.md for TaskFlow: build/coverage/python version/license badges, feature list, 5-step quickstart, detailed installation (venv + Docker options), environment variable reference table, API quick reference from docs/openapi.yaml, contributing guide, license section."' },
    ],
    checklist: ['Google-style docstrings on all routers and services', 'ADR for FastAPI choice saved in docs/adr/', 'Sphinx build passes with 0 warnings', 'README with badges and quickstart generated', 'Files committed to taskflow/docs/'],
  },
  {
    id: 8, title: 'Claude API Integration', sprint: 'hard', base: 160, dur: '60 min',
    product: 'Anthropic SDK', objective: 'Integrate Claude API with streaming and Pydantic.',
    stack: 'anthropic SDK · Pydantic · async',
    feats: ['Anthropic Python SDK', 'System Prompts', 'Structured JSON Output', 'Multi-Turn Conversations', 'Async API Calls', 'Streaming'],
    pre: {
      type: 'match', title: 'Match the Anthropic Python SDK concepts',
      pairs: [
        ['client.messages.create()', 'Makes an API call to Claude'],
        ['system= parameter', "Sets Claude's persona and rules"],
        ['max_tokens=', 'Limits the response length'],
        ['message.content[0].text', 'Extracts text from the response'],
        ['AsyncAnthropic()', 'Async client for use with FastAPI'],
        ['model= parameter', 'Selects which Claude model to use'],
      ]
    },
    post: {
      type: 'mini', title: '15-minute challenge: add streaming to the summariser', secs: 900,
      task: 'Modify the task summariser endpoint to stream the response token-by-token. Use client.messages.stream() and return a FastAPI StreamingResponse with text/event-stream content type.',
      criteria: ['Uses async with client.messages.stream() context manager', 'FastAPI endpoint returns StreamingResponse', 'Content-Type header is text/event-stream', 'Frontend receives tokens progressively, not buffered']
    },
    bonus: {
      cmd: 'claude "Add a Smart Reply feature to TaskFlow: when a user views a task detail page, Claude suggests 3 relevant next actions based on the task title, description, due date, and current status. Implement as POST /ai/suggest-actions FastAPI endpoint and an HTMX partial template."',
      mission: 'Implement Smart Reply end-to-end. Test it with 5 different task types. Evaluate the suggestion quality and add one system-prompt refinement. +30 XP'
    },
    exs: [
      { id: '8A', title: 'Async Task Summariser', desc: 'Build the AI summariser using AsyncAnthropic inside a FastAPI endpoint.', cmd: 'claude "Build POST /ai/summarise/{task_id} endpoint: use anthropic.AsyncAnthropic(), fetch task and comments from DB, call claude-sonnet-4-20250514 with system prompt instructing a 3-bullet engineering PM summary, return JSON {summary: str}. Fully non-blocking async."' },
      { id: '8B', title: 'Priority Predictor', desc: 'Structured JSON output from Claude with Pydantic validation.', cmd: 'claude "Build POST /ai/predict-priority. System prompt must enforce JSON output only: {predicted_priority: 1-5, confidence: 0.0-1.0, reasoning: str max 200 chars, deadline_shift_days: int}. Validate Claude\'s response with a Pydantic model. Handle JSON parse errors with a fallback response."' },
      { id: '8C', title: 'NL Task Parser', desc: 'Multi-turn conversation in Redis for ambiguity resolution.', cmd: 'claude "Build POST /ai/parse-task: user sends plain-text task description, Claude returns a TaskCreate Pydantic model. If the assignee name is ambiguous, store the conversation turn in Redis and return a clarification question as JSON {clarification: str}. Continue conversation until fully parsed."' },
    ],
    checklist: ['Async summariser working with real task data', 'Priority predictor returning Pydantic-validated JSON', 'NL parser with multi-turn Redis conversation', 'Streaming endpoint returning text/event-stream', 'All AI code saved in taskflow/app/ai/'],
  },
  {
    id: 9, title: 'MCP Integration', sprint: 'boss', base: 200, dur: '90 min',
    product: 'MCP', objective: 'Connect AI to external tools via Model Context Protocol.',
    stack: 'MCP · GitHub · Slack · PostgreSQL',
    feats: ['MCP Protocol', 'Tool Use', 'Custom MCP Server', 'GitHub Automation', 'DB Orchestration', 'Slack Integration'],
    pre: {
      type: 'bug', title: 'Find why this MCP config will not connect',
      lines: ['{', '  "mcpServers": {', '    "github": {', '      "command": "npx",', '      "args": ["@modelcontextprotocol/server-github"],', '      "env": {', '        "GITHUB_TOKEN": "ghp_abc123"', '      }', '    }', '  }', '}'],
      bugs: [4, 6],
      explains: [
        'Line 5 — Missing -y flag: npx without -y prompts interactively for package install confirmation, hanging the server process indefinitely',
        'Line 7 — Wrong env key: the GitHub MCP server requires GITHUB_PERSONAL_ACCESS_TOKEN specifically — GITHUB_TOKEN is not recognised and auth silently fails'
      ]
    },
    post: {
      type: 'output', title: 'Verify your MCP tool calls actually execute',
      steps: [
        'claude --mcp-config .mcp/config.json (opens Claude Code with MCP servers)',
        'Type: "List all open issues in my GitHub repo" — confirm a real API call is made',
        'Type: "Query the TaskFlow database for all tasks due today" — confirm SQL executes',
        'Type: "Send a test Slack message to #general saying MCP is live" — verify delivery'
      ]
    },
    bonus: {
      cmd: 'claude --mcp-config .mcp/config.json "Using GitHub, Postgres, and Slack tools: 1) Query the DB for tasks overdue by more than 2 days 2) Create a GitHub issue for each one titled [OVERDUE] {task title} 3) Post a summary to #standup with total count and top 3 most overdue. Do this as a single automated workflow."',
      mission: 'Run the full orchestration. Log all tool calls Claude makes. Identify any ambiguous step and improve the prompt to eliminate clarification. +30 XP'
    },
    exs: [
      { id: '9A', title: 'MCP Server Configuration', desc: 'Configure GitHub, PostgreSQL, and Slack MCP servers.', cmd: 'Create .mcp/config.json with: github server (npx -y @modelcontextprotocol/server-github, env GITHUB_PERSONAL_ACCESS_TOKEN), postgres server (npx -y @modelcontextprotocol/server-postgres, env POSTGRES_URL=postgresql://localhost/taskflow), slack server (npx -y @modelcontextprotocol/server-slack, env SLACK_BOT_TOKEN)' },
      { id: '9B', title: 'GitHub Automation', desc: 'Drive GitHub via natural language in Claude Code.', cmd: 'claude --mcp-config .mcp/config.json "Create a GitHub issue for the N+1 query bug from Lab 06. Assign it to me, label it bug and high-priority, add it to the v1.0 milestone. Then list all open PRs that have been waiting for review for more than 3 days."' },
      { id: '9C', title: 'DB + Slack Orchestration', desc: 'Multi-tool workflow: query PostgreSQL, compose messages, post to Slack.', cmd: 'claude --mcp-config .mcp/config.json "Query the TaskFlow PostgreSQL DB for all tasks overdue by more than 2 days grouped by assignee. For each assignee: send a personalised Slack DM listing their overdue tasks. Then post a summary count to the #standup channel."' },
      { id: '9D', title: 'Custom MCP Bridge Server', desc: 'Build a Node.js MCP server wrapping the TaskFlow FastAPI internal API.', cmd: 'claude "Build a Node.js MCP server in taskflow-mcp-bridge/index.js using @modelcontextprotocol/sdk and StdioServerTransport. Expose tools: create_task, list_overdue_tasks, update_task_status. Each tool calls the FastAPI API at localhost:8000 using the API token from env TASKFLOW_API_TOKEN."' },
    ],
    checklist: ['MCP config with GitHub, Postgres, and Slack servers working', 'GitHub issue created via natural language command', 'Overdue task Slack DMs delivered successfully', 'Custom FastAPI MCP bridge server built and tested', 'Full DB → GitHub Issues → Slack workflow automated'],
  },
  {
    id: 10, title: 'Capstone Sprint', sprint: 'final', base: 300, dur: '120 min',
    product: 'All Products', objective: 'Deliver an end-to-end AI-powered Capstone project.',
    expectedOutputImage: '/assets/validation/lab10_digest.png',
    stack: 'Full Stack · All Features',
    feats: ['All Claude Features', 'Timed Sprint', 'End-to-End Build', 'Code Review', 'MCP Delivery', 'Live Demo'],
    pre: {
      type: 'reflection', title: 'Capstone readiness self-assessment',
      qs: [
        'Rate your confidence in each area 1–5: FastAPI routing, SQLAlchemy async, Pytest fixtures, Claude API integration, MCP tool use. Where are the gaps and how will you address them?',
        'Before starting, describe in 3 sentences how you would architect the Smart Daily Digest feature without Claude Code. What would take the longest?',
        'Which Claude Code prompt pattern has been most useful across labs 1–9? Describe a specific example.'
      ]
    },
    post: {
      type: 'reflection', title: 'Capstone retrospective',
      qs: [
        'Walk through your completed feature end-to-end: ideation → architecture → code → tests → docs → MCP delivery. Which phase benefited most from Claude Code?',
        'Pick any 20 consecutive lines of Claude-generated code in your project. Explain every line as if teaching a junior developer. What did you have to look up?',
        'What would you build next with Claude Code? Write a one-paragraph pitch for the next TaskFlow feature.'
      ]
    },
    bonus: {
      cmd: 'claude "You are a senior engineer. Review the entire TaskFlow project: all files in app/, tests/, and docs/. Provide: top 3 architecture concerns, top 3 security risks, top 3 performance bottlenecks, and a prioritised action list. Be specific with file names and line numbers."',
      mission: 'Address every Critical finding from the review. Then record a 2-minute demo walkthrough of the Smart Daily Digest feature as if presenting to a stakeholder. +30 XP'
    },
    exs: [
      { id: '10A', title: 'Ideation Phase (15 min)', desc: 'Generate stories and architecture for the Smart Daily Digest.', cmd: 'claude "Sprint mode — 15 minutes. Generate 5 user stories for a Smart Daily Digest feature: Celery beat task at 9AM, Claude API ranks top 3 priority tasks, overdue task nudge with suggestions, Slack delivery via MCP. Gherkin format + FastAPI endpoint hints. Save to docs/DIGEST_PRD.md"' },
      { id: '10B', title: 'Implementation Phase (45 min)', desc: 'Build the Celery task, Claude API integration, and Slack delivery.', cmd: 'claude "Implement Smart Daily Digest: app/tasks/digest.py Celery shared_task, anthropic.Anthropic() sync client for task ranking and message composition, Slack delivery via MCP config. Include retry logic with max_retries=3 and proper error logging. Save all new files."' },
      { id: '10C', title: 'Test + Doc Phase (30 min)', desc: 'Generate tests and documentation for the new feature.', cmd: 'claude "Generate Pytest tests for app/tasks/digest.py: mock anthropic.Anthropic() client, test Celery task with CELERY_TASK_ALWAYS_EAGER=True setting, verify Slack MCP tool call is made with correct parameters. Then add Google-style docstrings to all new functions."' },
      { id: '10D', title: 'Review + Demo (30 min)', desc: 'Final code review and demo preparation.', cmd: 'claude "Final code review of all files added in Lab 10. Zero tolerance for Critical or High severity issues. Fix anything found. Then generate a 5-slide presentation outline in Markdown for a 5-minute stakeholder demo of the Smart Daily Digest feature."' },
    ],
    checklist: ['Celery beat task triggers correctly at scheduled time', 'Claude API ranks tasks and composes personalised digest message', 'Slack delivery via MCP working end-to-end', '80%+ test coverage on all new Lab 10 code', 'Google-style docstrings on all new functions', 'Zero Critical/High code review findings', 'Can explain every line of AI-generated code to a teammate'],
  },
];

// Stack Commands reference
export const STACK_COMMANDS = [
  ['Start dev server', 'uvicorn app.main:app --reload --port 8000'],
  ['Run migrations', 'alembic upgrade head'],
  ['Run all tests', 'pytest --asyncio-mode=auto --cov=app'],
  ['Open Claude Code', 'claude  (in project root)'],
  ['Claude Code + MCP', 'claude --mcp-config .mcp/config.json'],
  ['Start Celery worker', 'celery -A app.worker worker --loglevel=info'],
  ['Lint and format', 'ruff check . && ruff format .'],
  ['Type check', 'mypy app/ --strict'],
  ['Build Sphinx docs', 'cd docs && sphinx-build -b html . _build/html'],
  ['Generate OpenAPI JSON', 'curl http://localhost:8000/openapi.json > docs/openapi.json'],
];
