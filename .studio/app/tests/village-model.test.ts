// Unit tests: village model logic (pure functions, no React/browser)
import {
  HQ, ENG_BLDG, RD_BLDG, CRE_BLDG, ALL_BLDGS,
  buildingForTeam, hqDoor, pathPoints,
  homePos, hqSlot, truncate,
  walkDir, eventKey, routeFor,
  startWalk, isWalking, posAt, pointOnPolyline, polyLength,
  allAgentIds, charOf, PATHS,
} from '../src/features/village/model';
import type { StudioEvent } from '../src/api';
import type { Dept } from '../src/features/org/model';

// --- helpers ---
let pass = 0, fail = 0;
function assert(cond: boolean, msg: string) {
  if (cond) { pass++; console.log(`  ✓ ${msg}`); }
  else { fail++; console.error(`  ✗ FAIL: ${msg}`); }
}

// --- mock roster ---
const MOCK_ROSTER = {
  agents: {
    owner: { name: 'Owner', title: 'CEO', team: 'owner' as const, color: '#f00', bio: '' },
    manager: { name: 'Eng Manager', title: 'EM', team: 'eng' as const, color: '#0f0', bio: '' },
    'frontend-dev': { name: 'Frontend', title: 'Dev', team: 'eng' as const, color: '#0f0', bio: '' },
    'qa-engineer': { name: 'QA', title: 'QA', team: 'eng' as const, color: '#0f0', bio: '' },
    'rd-manager': { name: 'R&D Mgr', title: 'R&D', team: 'rd' as const, color: '#00f', bio: '' },
    'creative-director': { name: 'Creative', title: 'CD', team: 'creative' as const, color: '#f0f', bio: '' },
  }
};

const DEPTS: Dept[] = [
  { team: 'eng', headId: 'manager', label: 'Engineering', members: ['frontend-dev', 'qa-engineer'] },
  { team: 'rd', headId: 'rd-manager', label: 'R&D', members: [] },
  { team: 'creative', headId: 'creative-director', label: 'Creative', members: [] },
];

// =====================
console.log('\n=== Village Model Unit Tests ===\n');

// 1. Layout constants
console.log('Layout constants');
assert(HQ.id === 'hq', 'HQ has id "hq"');
assert(HQ.x === 400 && HQ.y === 100, 'HQ centered top');
assert(ENG_BLDG.id === 'eng' && ENG_BLDG.team === 'eng', 'Engineering building');
assert(RD_BLDG.id === 'rd' && RD_BLDG.team === 'rd', 'R&D building');
assert(CRE_BLDG.id === 'creative' && CRE_BLDG.team === 'creative', 'Creative building');
assert(ALL_BLDGS.length === 4, '4 buildings total');
assert(PATHS.length === 3, '3 paths (no path for HQ)');

// 2. buildingForTeam
console.log('\nbuildingForTeam');
assert(buildingForTeam('eng').id === 'eng', 'eng → ENG_BLDG');
assert(buildingForTeam('rd').id === 'rd', 'rd → RD_BLDG');
assert(buildingForTeam('creative').id === 'creative', 'creative → CRE_BLDG');

// 3. hqDoor
console.log('\nhqDoor');
const door = hqDoor();
assert(door.x === HQ.x, 'door x === HQ.x');
assert(door.y === HQ.y + HQ.h / 2, 'door y === HQ bottom center');

// 4. pathPoints — returns polyline with 4 points
console.log('\npathPoints');
const engPath = pathPoints(ENG_BLDG);
assert(engPath.length === 4, 'path has 4 points (door → elbow → elbow → building front)');
assert(engPath[0].x === door.x && engPath[0].y === door.y, 'path starts at HQ door');
const lastPt = engPath[3];
assert(lastPt.x === ENG_BLDG.x, 'path ends at building x');
assert(lastPt.y < ENG_BLDG.y, 'path ends above building center (front)');

// 5. homePos
console.log('\nhomePos');
assert(homePos('owner', DEPTS).x < door.x, 'owner left of door');
assert(homePos('manager', DEPTS).x > door.x, 'manager right of door');
const qaHome = homePos('qa-engineer', DEPTS);
assert(qaHome.y < ENG_BLDG.y, 'eng member homes above eng building');

// 6. hqSlot
console.log('\nhqSlot');
const slot1 = hqSlot('frontend-dev');
const slot2 = hqSlot('qa-engineer');
assert(slot1.x !== slot2.x || slot1.y !== slot2.y, 'different agents get different HQ slots');

// 7. truncate
console.log('\ntruncate');
assert(truncate('hello', 10) === 'hello', 'no-op when under limit');
assert(truncate('a very long task name here', 10) === 'a very long…', 'truncates with ellipsis');
assert(truncate('', 5) === '', 'empty string returns empty');
assert(truncate(undefined as any, 5) === '', 'undefined returns empty');

// 8. walkDir
console.log('\nwalkDir');
assert(walkDir({ ts: 1, type: 'done', agent: 'qa-engineer' } as StudioEvent) === 'to-hq', "'done' → to-hq");
assert(walkDir({ ts: 1, type: 'start', agent: 'qa-engineer' } as StudioEvent) === 'to-home', "'start' → to-home");
assert(walkDir({ ts: 1, type: 'progress', agent: 'qa-engineer' } as StudioEvent) === null, "'progress' → null");
assert(walkDir({ ts: 1, type: 'done', agent: 'owner' } as StudioEvent) === null, "owner never walks");

// 9. eventKey uniqueness
console.log('\neventKey');
const e1: StudioEvent = { ts: 100, type: 'done', agent: 'qa' };
const e2: StudioEvent = { ts: 200, type: 'done', agent: 'qa' };
assert(eventKey(e1) !== eventKey(e2), 'different timestamps → different keys');
const e3: StudioEvent = { ts: 100, type: 'start', agent: 'qa' };
assert(eventKey(e1) !== eventKey(e3), 'different types → different keys');

// 10. routeFor
console.log('\nrouteFor');
const cur = homePos('qa-engineer', DEPTS);
const toHqRoute = routeFor('qa-engineer', 'to-hq', cur, DEPTS);
assert(toHqRoute.length > 2, 'to-hq route has multiple points');
assert(toHqRoute[0].x === cur.x && toHqRoute[0].y === cur.y, 'route starts at current pos');
const toHomeRoute = routeFor('qa-engineer', 'to-home', toHqRoute[toHqRoute.length - 1], DEPTS);
assert(toHomeRoute.length > 2, 'to-home route has multiple points');

// 11. polyLength
console.log('\npolyLength');
assert(polyLength([{ x: 0, y: 0 }]) === 0, 'single point → length 0');
const len = polyLength([{ x: 0, y: 0 }, { x: 3, y: 4 }]);
assert(Math.abs(len - 5) < 0.001, '3-4-5 triangle → length 5');

// 12. pointOnPolyline
console.log('\npointOnPolyline');
const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
const mid = pointOnPolyline(pts, 0.5);
assert(Math.abs(mid.x - 5) < 0.01, 'midpoint at f=0.5');
assert(pointOnPolyline(pts, 0).x === 0, 'f=0 → first point');
assert(pointOnPolyline(pts, 1).x === 10, 'f=1 → last point');
assert(pointOnPolyline([], 0.5).x === 0, 'empty polyline → origin');

// 13. startWalk / isWalking / posAt
console.log('\nwalking lifecycle');
const now = Date.now();
const route = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
const walk = startWalk(route, now, false);
assert(isWalking(walk, now + 100), 'walking shortly after start');
assert(walk.duration >= 500, 'min walk duration respected');
assert(posAt(walk, now + walk.duration + 1).x === walk.to.x, 'parked at destination after walk');

// reduced motion: duration = 0
const reducedWalk = startWalk(route, now, true);
assert(reducedWalk.duration === 0, 'reduced motion → duration 0');
assert(!isWalking(reducedWalk, now), 'instant walk not considered in-progress');
assert(posAt(reducedWalk, now).x === walk.to.x, 'reduced motion parks at destination');

// 14. allAgentIds
console.log('\nallAgentIds');
const ids = allAgentIds(MOCK_ROSTER);
assert(ids.includes('owner'), 'includes owner');
assert(ids.includes('manager'), 'includes manager');
assert(ids.includes('frontend-dev'), 'includes frontend-dev');
assert(ids.includes('qa-engineer'), 'includes qa-engineer');
assert(ids.includes('rd-manager'), 'includes rd-manager');
assert(ids.includes('creative-director'), 'includes creative-director');
assert(new Set(ids).size === ids.length, 'no duplicate ids');

// 15. charOf
console.log('\ncharOf');
assert(charOf(MOCK_ROSTER, 'owner')?.name === 'Owner', 'charOf returns correct character');
assert(charOf(MOCK_ROSTER, 'nonexistent') === undefined, 'charOf returns undefined for missing');
assert(charOf(undefined, 'owner') === undefined, 'charOf returns undefined for missing roster');

// =====================
console.log(`\n=== Results: ${pass} passed, ${fail} failed ===\n`);
if (fail > 0) throw new Error(`${fail} test(s) failed`);
