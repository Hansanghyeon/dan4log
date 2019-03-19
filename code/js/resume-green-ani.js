//////////////////////////////////////////////////////////// 
////////////     Plant Life App: Prototype 1     /////////// 
////////////////////////////////////////////////////////////





///////////////////// VERLET.JS ////////////////////////////




////---INITIATION---////


///canvas  (*canvas width & height must be equal to retain aspect ratio)
var canvasContainerDiv = document.getElementById("canvas_container_div");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvRatio = 1; //0.8;  // canvas ratio, as canvas size to lowest of window width or height

///trackers
var points = [],
    pointCount = 0;
var spans = [],
    spanCount = 0;
var skins = [],
    skinCount = 0;
var worldTime = 0; // time as frame count

///settings
var gravity = 0.01; // (rate of y-velocity increase per frame per point mass of 1)
var rigidity = 10; // global span rigidity (as iterations of position accuracy refinement)
var friction = 0.999; // (proportion of previous velocity after frame refresh)
var bounceLoss = 0.9; // (proportion of previous velocity after bouncing)
var skidLoss = 0.8; // (proportion of previous velocity if touching the ground)
var viewPoints = false; // (point visibility)
var viewSpans = false; // (span visibility)
var viewScaffolding = false; // (scaffolding visibility)
var viewSkins = true; // (skin visibility)
var breeze = 0.4; // breeziness level (applied as brief left & right gusts)




////---OBJECTS---////


///point constructor
function Point(current_x, current_y, materiality = "material") { // materiality can be "material" or "immaterial"
    this.cx = current_x;
    this.cy = current_y;
    this.px = this.cx; // previous x value
    this.py = this.cy; // previous y value
    this.mass = 1; // (as ratio of gravity)
    this.materiality = materiality;
    this.fixed = false;
    this.id = pointCount;
    pointCount += 1;
}

///span constructor
function Span(point_1, point_2, visibility = "visible") { // visibility can be "visible" or "hidden"
    this.p1 = point_1;
    this.p2 = point_2;
    this.l = distance(this.p1, this.p2); // length
    this.strength = 1; // (as ratio of rigidity)
    this.visibility = visibility;
    this.id = spanCount;
    spanCount += 1;
}

///skins constructor
function Skin(points_array, color) {
    this.points = points_array; // an array of points for skin outline path
    this.color = color;
    this.id = skinCount;
    skinCount += 1;
}




////---FUNCTIONS---////


///scales canvas to window
function scaleToWindow() {
    if (window.innerWidth > window.innerHeight) {
        canvasContainerDiv.style.height = window.innerHeight * canvRatio + "px";
        canvasContainerDiv.style.width = canvasContainerDiv.style.height;
    } else {
        canvasContainerDiv.style.width = window.innerWidth * canvRatio + "px";
        canvasContainerDiv.style.height = canvasContainerDiv.style.width;
    }
}

///converts percentage to canvas x value
function xValFromPct(percent) {
    return percent * canvas.width / 100;
}

///converts percentage to canvas y value
function yValFromPct(percent) {
    return percent * canvas.height / 100;
}

///converts canvas x value to percentage of canvas width
function pctFromXVal(xValue) {
    return xValue * 100 / canvas.width;
}

///converts canvas y value to percentage of canvas height
function pctFromYVal(yValue) {
    return yValue * 100 / canvas.height;
}

///gets a point by id number
function getPt(id) {
    for (var i = 0; i < points.length; i++) {
        if (points[i].id == id) {
            return points[i];
        }
    }
}

///gets distance between two points (pythogorian theorum)
function distance(point_1, point_2) {
    var x_difference = point_2.cx - point_1.cx;
    var y_difference = point_2.cy - point_1.cy;
    return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
}

///gets a span's mid point (returns object: { x: <value>, y: <value> } )
function smp(span) {
    var mx = (span.p1.cx + span.p2.cx) / 2; // mid x value
    var my = (span.p1.cy + span.p2.cy) / 2; // mid y value
    return {
        x: mx,
        y: my
    };
}

///removes a span by id
function removeSpan(id) {
    for (var i = 0; i < spans.length - 1; i++) {
        if (spans[i].id === id) {
            spans.splice(i, 1);
        }
    }
}

///creates a point object instance
function addPt(xPercent, yPercent, materiality = "material") {
    points.push(new Point(xValFromPct(xPercent), yValFromPct(yPercent), materiality));
    return points[points.length - 1];
}

///creates a span object instance
function addSp(p1, p2, visibility = "visible") {
    spans.push(new Span(getPt(p1), getPt(p2), visibility));
    return spans[spans.length - 1];
}

///creates a skin object instance
function addSk(id_path_array, color) {
    var points_array = [];
    for (var i = 0; i < id_path_array.length; i++) {
        points_array.push(points[id_path_array[i]]);
    }
    skins.push(new Skin(points_array, color));
    return skins[skins.length - 1];
}

///updates point positions based on verlet velocity (i.e., current coord minus previous coord)
function updatePoints() {
    for (var i = 0; i < points.length; i++) {
        var p = points[i]; // point object
        if (!p.fixed) {
            var xv = (p.cx - p.px) * friction; // x velocity
            var yv = (p.cy - p.py) * friction; // y velocity
            if (p.py >= canvas.height - 1 && p.py <= canvas.height) {
                xv *= skidLoss;
            }
            p.px = p.cx; // updates previous x as current x
            p.py = p.cy; // updates previous y as current y
            p.cx += xv; // updates current x with new velocity
            p.cy += yv; // updates current y with new velocity
            p.cy += gravity * p.mass; // add gravity to y
            if (worldTime % Tl.rib(100, 200) === 0) {
                p.cx += Tl.rfb(-breeze, breeze);
            } // apply breeze to x
        }
    }
}

///applies constrains
function applyConstraints(currentIteration) {
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        //wall constraints (inverts velocity if point moves beyond a canvas edge)
        if (p.materiality === "material") {
            if (p.cx > canvas.width) {
                p.cx = canvas.width;
                p.px = p.cx + (p.cx - p.px) * bounceLoss;
            }
            if (p.cx < 0) {
                p.cx = 0;
                p.px = p.cx + (p.cx - p.px) * bounceLoss;
            }
            if (p.cy > canvas.height) {
                p.cy = canvas.height;
                p.py = p.cy + (p.cy - p.py) * bounceLoss;
            }
            if (p.cy < 0) {
                p.cy = 0;
                p.py = p.cy + (p.cy - p.py) * bounceLoss;
            }
        }
    }
}

///updates span positions and adjusts associated points
function updateSpans(currentIteration) {
    for (var i = 0; i < spans.length; i++) {
        var thisSpanIterations = Math.round(rigidity * spans[i].strength);
        if (currentIteration + 1 <= thisSpanIterations) {
            var s = spans[i];
            var dx = s.p2.cx - s.p1.cx; // distance between x values
            var dy = s.p2.cy - s.p1.cy; // distance between y values
            var d = Math.sqrt(dx * dx + dy * dy); // distance between the points
            var r = s.l / d; // ratio (span length over distance between points)
            var mx = s.p1.cx + dx / 2; // midpoint between x values 
            var my = s.p1.cy + dy / 2; // midpoint between y values
            var ox = dx / 2 * r; // offset of each x value (compared to span length)
            var oy = dy / 2 * r; // offset of each y value (compared to span length)
            if (!s.p1.fixed) {
                s.p1.cx = mx - ox; // updates span's first point x value
                s.p1.cy = my - oy; // updates span's first point y value
            }
            if (!s.p2.fixed) {
                s.p2.cx = mx + ox; // updates span's second point x value
                s.p2.cy = my + oy; // updates span's second point y value
            }
        }
    }
}

///refines points for position accuracy & shape rigidity by updating spans and applying constraints iteratively
function refinePositions() {
    var requiredIterations = rigidity;
    for (var i = 0; i < spans.length; i++) {
        var thisSpanIterations = Math.round(rigidity * spans[i].strength);
        if (thisSpanIterations > requiredIterations) {
            requiredIterations = thisSpanIterations;
        }
    }
    for (var j = 0; j < requiredIterations; j++) {
        updateSpans(j);
        applyConstraints(i);
    }
}

///displays points
function renderPoints() {
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(p.cx, p.cy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

///displays spans
function renderSpans() {
    for (var i = 0; i < spans.length; i++) {
        var s = spans[i];
        if (s.visibility == "visible") {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "blue";
            ctx.moveTo(s.p1.cx, s.p1.cy);
            ctx.lineTo(s.p2.cx, s.p2.cy);
            ctx.stroke();
        }
    }
}

///displays scaffolding & binding spans (i.e., "hidden" spans)
function renderScaffolding() {
    ctx.beginPath();
    for (var i = 0; i < spans.length; i++) {
        var s = spans[i];
        if (s.visibility === "hidden") {
            ctx.strokeStyle = "pink";
            ctx.moveTo(s.p1.cx, s.p1.cy);
            ctx.lineTo(s.p2.cx, s.p2.cy);
        }
    }
    ctx.stroke();
}

///displays skins 
function renderSkins() {
    for (var i = 0; i < skins.length; i++) {
        var s = skins[i];
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.fillStyle = s.color;
        ctx.moveTo(s.points[0].cx, s.points[0].cy);
        for (var j = 1; j < s.points.length; j++) {
            ctx.lineTo(s.points[j].cx, s.points[j].cy);
        }
        ctx.lineTo(s.points[0].cx, s.points[0].cy);
        ctx.stroke();
        ctx.fill();
    }
}

///clears canvas frame
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

///renders all visible components
function renderImages() {
    //if ( viewSkins ) { renderSkins(); }  // disabled here so plants can be rendered sequentially in plants.js
    if (viewSpans) {
        renderSpans();
    }
    if (viewPoints) {
        renderPoints();
    }
    if (viewScaffolding) {
        renderScaffolding();
    }
}




////---EVENTS---////


///scaling
window.addEventListener('resize', scaleToWindow);




////---RUN---////


function runVerlet() {
    scaleToWindow();
    updatePoints();
    refinePositions();
    clearCanvas();
    renderImages();
    worldTime++;
}









////////////////////// TOOLS.JS ////////////////////////////



const Tl = {

    //random integer between two numbers (min/max inclusive)
    rib: function (min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    },

    //random float between two numbers
    rfb: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    //converts radians to degrees
    radToDeg: function (radian) {
        return radian * 180 / Math.PI;
    },

    //converts degrees to radians
    degToRad: function (degree) {
        return degree / 180 * Math.PI;
    },

    //pauses program
    pause: function (milliseconds) {
        var then = Date.now();
        var now;
        do {
            now = Date.now()
        } while (now - then < milliseconds);
    }


};









/////////////////////////////////////////////////////////////
///////////////////// PLANT LIFE ////////////////////////////
/////////////////////////////////////////////////////////////




////---INITIATION---////


///trackers
var plants = [],
    plantCount = 0;
var sunRays = [],
    sunRayCount = 0;
var shadows = [],
    shadowCount = 0;

///settings
var worldSpeed = 1; //3;  // (as frames per iteration; higher is slower) (does not affect physics iterations)
var restrictGrowthByEnergy = false; // restricts plant growth by energy level (if false plants grow freely)
var viewShadows = false; // (shadow visibility)
var phr = 2; // photosynthesis rate ( rate plants store energy from sunlight )
var geer = 0.5; // growth energy expenditure rate (rate energy is expended for growth)
var leer = 0.03; // living energy expenditure rate (rate energy is expended for living, per segment)




////---OBJECTS---////


///plant constructor
function Plant(xLocation) {
    this.id = plantCount;
    this.segments = [];
    this.segmentCount = 0;
    this.xLocation = xLocation;
    this.energy = 5000; // seed energy (starting energy level at germination)
    this.isAlive = true;
    //settings
    this.forwardGrowthRate = gravity * Tl.rfb(35, 50); //Tl.rfb(18,22);  // (rate of cross spans increase per frame)
    this.outwardGrowthRate = this.forwardGrowthRate * Tl.rfb(0.18, 0.22); // (rate forward span widens per frame)
    this.maxSegmentWidth = Tl.rfb(11, 13); // maximum segment width (in pixels)
    this.maxTotalSegments = Tl.rib(10, 20); // maximum total number of segments
    this.firstLeafSegment = Tl.rib(2, 4); // (segment on which first leaf set grows)
    this.leafFrequency = Tl.rib(2, 3); // (number of segments until next leaf set)
    this.maxLeaflength = this.maxSegmentWidth * Tl.rfb(4, 7); // maximum leaf length at maturity
    this.leafGrowthRate = this.forwardGrowthRate * Tl.rfb(1.4, 1.6); // leaf growth rate
    //base segment
    this.ptB1 = addPt(this.xLocation - 0.1, 100); // base point 1
    this.ptB2 = addPt(this.xLocation + 0.1, 100); // base point 2
    this.ptB1.fixed = this.ptB2.fixed = true; // fixes base points to ground
    this.spB = addSp(this.ptB1.id, this.ptB2.id); // adds base span
    createSegment(this, null, this.ptB1, this.ptB2); // creates the base segment (with "null" parent)
}


///segment constructor
function Segment(plant, parentSegment, basePoint1, basePoint2) {
    this.plantId = plant.id;
    this.id = plant.segmentCount;
    this.childSegment = null;
    this.hasChildSegment = false;
    this.parentSegment = parentSegment;
    this.isBaseSegment = false;
    if (this.parentSegment === null) {
        this.isBaseSegment = true;
    }
    this.hasLeaves = false;
    this.hasLeafScaffolding = false;
    //settings
    this.forwardGrowthRateVariation = Tl.rfb(0.95, 1.05); //(0.95,1.05);  // forward growth rate variation
    this.mass = 1; // mass of the segment stalk portion ( divided between the two extension points)
    this.strength = 1.5; // as multiple of global rigidity (higher values effect performance)
    //base points
    this.ptB1 = basePoint1; // base point 1
    this.ptB2 = basePoint2; // base point 2
    //extension points
    var originX = (this.ptB1.cx + this.ptB2.cx) / 2; // center of base points x values
    var originY = (this.ptB1.cy + this.ptB2.cy) / 2; // center of base points y values
    this.ptE1 = addPt(pctFromXVal(originX) - 0.1, pctFromYVal(originY) - 0.1); // extension point 1
    this.ptE2 = addPt(pctFromXVal(originX) + 0.1, pctFromYVal(originY) - 0.1); // extension point 2
    this.ptE1.mass = this.mass / 2;
    this.ptE2.mass = this.mass / 2;
    //spans
    this.spL = addSp(this.ptB1.id, this.ptE1.id); // left span
    this.spR = addSp(this.ptB2.id, this.ptE2.id); // right span
    this.spF = addSp(this.ptE1.id, this.ptE2.id); // forward span
    this.spCd = addSp(this.ptE1.id, this.ptB2.id); // downward (l to r) cross span
    this.spCu = addSp(this.ptB1.id, this.ptE2.id); // new upward (l to r) cross span
    this.spL.rigidity = this.strength;
    this.spR.rigidity = this.strength;
    this.spF.rigidity = this.strength;
    this.spCd.rigidity = this.strength;
    this.spCu.rigidity = this.strength;
    //base segment
    if (!this.isBaseSegment) {
        this.spCdP = addSp(this.ptE1.id, this.parentSegment.ptB2.id); // downward (l to r) cross span to parent
        this.spCuP = addSp(this.parentSegment.ptB1.id, this.ptE2.id); // upward (l to r) cross span to parent
        this.spCdP.rigidity = this.strength;
        this.spCdP.rigidity = this.strength;
    }
    //leaves
    this.ptLf1 = null; // leaf point 1 (leaf tip)
    this.ptLf2 = null; // leaf point 2 (leaf tip)  
    this.spLf1 = null; // leaf 1 Span
    this.spLf2 = null; // leaf 2 Span
    //skins
    this.skins = [];
    this.skins.push(addSk([this.ptE1.id, this.ptE2.id, this.ptB2.id, this.ptB1.id], "darkgreen"));
}

///sun ray constructor
function SunRay() {
    this.id = sunRayCount;
    this.x = xValFromPct(this.id);
    this.intensity = 1;
    this.leafContacts = []; // (as array of objects: { y: <leaf contact y value>, plant: <plant> })
}

//shadow constructor
function Shadow(leafSpan) {
    this.p1 = leafSpan.p1;
    this.p2 = leafSpan.p2;
    this.p3 = {
        cx: this.p2.cx,
        cy: yValFromPct(100)
    };
    this.p4 = {
        cx: this.p1.cx,
        cy: yValFromPct(100)
    };
}




////---FUNCTIONS---////


//creates a new plant
function createPlant() {
    plantCount++;
    plants.push(new Plant(Tl.rib(10, 90)));
}

///creates a new segment
function createSegment(plant, parentSegment, basePoint1, basePoint2) {
    plant.segmentCount++;
    plant.segments.unshift(new Segment(plant, parentSegment, basePoint1, basePoint2));
    if (parentSegment !== null) {
        parentSegment.childSegment = plant.segments[plant.segments.length - 1];
        parentSegment.hasChildSegment = true;
    }
}

///creates a new sun ray (one for each x value as an integer percentage of the canvas's width)
function createSunRays() {
    for (var i = 0; i < 101; i++) {
        sunRays.push(new SunRay());
        sunRayCount++;
    }
}

///gets each leaf span's y values at integer x values as points where sun rays contact leaf
function markRayLeafIntersections() {
    for (var i = 0; i < plants.length; i++) {
        var p = plants[i];
        for (var j = 0; j < p.segments.length; j++) {
            var s = p.segments[j];
            if (s.hasLeaves) {
                var p1, p2;
                //leaf 1
                //assigns p1 as leftmost leaf span point and p2 as rightmost leaf span point
                if (s.ptLf1.cx < s.ptB1.cx) {
                    p1 = s.ptLf1;
                    p2 = s.ptB1;
                } else {
                    p1 = s.ptB1;
                    p2 = s.ptLf1;
                }
                //loops through leaf span's integer x values
                var xPctMin = Math.ceil(pctFromXVal(p1.cx));
                var xPctMax = Math.floor(pctFromXVal(p2.cx));
                for (var lcx = xPctMin; lcx <= xPctMax; lcx++) { // leaf contact x value
                    var lcy = p1.cy + (xValFromPct(lcx) - p1.cx) * (p2.cy - p1.cy) / (p2.cx - p1.cx); // leaf contact y value
                    //pushes corresponding y value and plant instance to associated sun ray instance
                    sunRays[lcx].leafContacts.push({
                        y: lcy,
                        plant: p
                    });
                }
                //leaf 2
                if (s.ptLf2.cx < s.ptB2.cx) {
                    p1 = s.ptLf2;
                    p2 = s.ptB2;
                } else {
                    p1 = s.ptB2;
                    p2 = s.ptLf2;
                }
                xPctMin = Math.ceil(pctFromXVal(p1.cx));
                xPctMax = Math.floor(pctFromXVal(p2.cx));
                for (lcx = xPctMin; lcx <= xPctMax; lcx++) { // leaf contact x value
                    lcy = p1.cy + (xValFromPct(lcx) - p1.cx) * (p2.cy - p1.cy) / (p2.cx - p1.cx); // leaf contact y value
                    sunRays[lcx].leafContacts.push({
                        y: lcy,
                        plant: p
                    });
                }
            }
        }
    }
}

///transfers energy from sun rays to leaves
function photosynthesize() {
    for (var i = 0; i < sunRays.length; i++) {
        var sr = sunRays[i]; // sun ray  
        //sorts leaf contact points from highest to lowest elevation (increasing y value)
        sr.leafContacts.sort(function (a, b) {
            return a.y - b.y
        });
        //when a sun ray hits a leaf, transfers half of the ray's intensity to the plant as energy
        for (var j = 0; j < sr.leafContacts.length; j++) {
            var lc = sr.leafContacts[j]; // leaf contact ({ y: <leaf contact y value>, plant: <plant> })
            sr.intensity /= 2;
            lc.plant.energy += sr.intensity * phr;
        }
        sr.leafContacts = [];
        sr.intensity = 1; // resets sun ray's leaf contact points & intensity for next iteration
    }
}

///sheds sunlight
function shedSunlight() {
    markRayLeafIntersections();
    photosynthesize();
}

///marks shadow positions (based on leaf spans)
function markShadowPositions(segment) {
    shadows.push(new Shadow(segment.spLf1));
    shadows.push(new Shadow(segment.spLf2));
}

///grows all plants
function growPlants() {
    for (var i = 0; i < plants.length; i++) {
        var plant = plants[i];
        //caps plant energy based on segment count
        if (plant.energy > plant.segmentCount * 1000 && plant.energy > 5000) {
            plant.energy = plant.segmentCount * 1000;
        }
        //checks for sufficient energy for growth (must be greater than zero to grow)
        if (plant.energy > 0 || !restrictGrowthByEnergy) {
            for (var j = 0; j < plants[i].segments.length; j++) {
                var segment = plants[i].segments[j];
                //lengthens segment spans
                if (segment.spF.l < plant.maxSegmentWidth && plant.segments.length < plant.maxTotalSegments) {
                    lengthenSegmentSpans(plant, segment);
                    plant.energy -= segment.spCd.l * geer; // reduces energy by a ratio of segment size
                }
                //generates new segment
                if (readyForChildSegment(plant, segment)) {
                    createSegment(plant, segment, segment.ptE1, segment.ptE2);
                }
                //handles leaves
                if (!segment.hasLeaves) {
                    generateLeavesWhenReady(plant, segment);
                } else if (plant.segments.length < plant.maxTotalSegments) {
                    growLeaves(plant, segment);
                    plant.energy -= (segment.spLf1.l + segment.spLf2.l) * geer; // reduces energy by a ratio of leaf length
                }
            }
        }
        //cost of living
        plant.energy -= plant.segmentCount * leer; // reduces energy by a ratio of segment count
    }
}

///lengthens segment spans for growth
function lengthenSegmentSpans(plant, segment) {
    if (segment.isBaseSegment) {
        segment.ptB1.cx -= plant.outwardGrowthRate / 2;
        segment.ptB2.cx += plant.outwardGrowthRate / 2;
        plant.spB.l = distance(segment.ptB1, segment.ptB2);
        segment.spCd.l = distance(segment.ptE1, segment.ptB2) + plant.forwardGrowthRate / 3;
        segment.spCu.l = segment.spCd.l;
    } else {
        segment.spCdP.l = distance(segment.ptE1, segment.parentSegment.ptB2) + plant.forwardGrowthRate;
        segment.spCuP.l = segment.spCdP.l * segment.forwardGrowthRateVariation;
        segment.spCd.l = distance(segment.ptE1, segment.ptB2);
        segment.spCu.l = distance(segment.ptB1, segment.ptE2);
    }
    segment.spF.l += plant.outwardGrowthRate;
    segment.spL.l = distance(segment.ptB1, segment.ptE1);
    segment.spR.l = distance(segment.ptB2, segment.ptE2);
}

///checks whether a segment is ready to generate a child segment
function readyForChildSegment(plant, segment) {
    return segment.spF.l > plant.maxSegmentWidth * 0.333 &&
        !segment.hasChildSegment &&
        plant.segmentCount < plant.maxTotalSegments;
}

///generates leaves when segment is ready
function generateLeavesWhenReady(plant, segment) {
    var p = plant;
    var s = segment;
    if (s.id >= p.firstLeafSegment &&
        s.id % p.leafFrequency === 0 &&
        s.spF.l > p.maxSegmentWidth * 0.1 ||
        s.id === p.maxTotalSegments - 1) {
        var fsmp = smp(s.spF); // forward span mid point ( { x: <value>, y: <value> } )
        s.ptLf1 = addPt(pctFromXVal(fsmp.x), pctFromYVal(fsmp.y - 1)); // leaf 1 tip point (left)
        s.ptLf2 = addPt(pctFromXVal(fsmp.x), pctFromYVal(fsmp.y - 1)); // leaf 2 tip point (right)
        s.spLf1 = addSp(s.ptB1.id, s.ptLf1.id); // leaf 1 span (left)
        s.spLf2 = addSp(s.ptB2.id, s.ptLf2.id); // leaf 2 span (right)
        s.leafTipsTetherSpan = addSp(s.ptLf1.id, s.ptLf2.id); // leaf tip tether span
        s.hasLeaves = true;
    }
}

///add leaf scaffolding
function addLeafScaffolding(plant, segment) {
    var p = plant;
    var s = segment;
    //remove leaf tips tether
    removeSpan(s.leafTipsTetherSpan.id);
    //apply leaf-unfold boosters
    s.ptLf1.cx -= gravity * 100;
    s.ptLf2.cx += gravity * 100;
    //add scaffolding points
    //(leaf 1)
    var x = s.ptE1.cx + (s.ptE1.cx - s.ptE2.cx) * 0.5;
    var y = s.ptE1.cy + (s.ptE1.cy - s.ptE2.cy) * 0.5;
    s.ptLf1ScA = addPt(pctFromXVal(x), pctFromXVal(y), "immaterial");
    s.ptLf1ScA.mass = 0;
    x = (s.ptLf1.cx + s.ptLf1ScA.cx) / 2;
    y = (s.ptLf1.cy + s.ptLf1ScA.cy) / 2;
    s.ptLf1ScB = addPt(pctFromXVal(x), pctFromXVal(y), "immaterial");
    s.ptLf1ScB.mass = 0;
    //(leaf 2)
    x = s.ptE2.cx + (s.ptE2.cx - s.ptE1.cx) * 0.5;
    y = s.ptE2.cy + (s.ptE2.cy - s.ptE1.cy) * 0.5;
    s.ptLf2ScA = addPt(pctFromXVal(x), pctFromXVal(y), "immaterial");
    s.ptLf2ScA.mass = 0;
    x = (s.ptLf2.cx + s.ptLf2ScA.cx) / 2;
    y = (s.ptLf2.cy + s.ptLf2ScA.cy) / 2;
    s.ptLf2ScB = addPt(pctFromXVal(x), pctFromXVal(y), "immaterial");
    s.ptLf2ScB.mass = 0;
    //add scaffolding spans
    //(leaf 1)
    s.spLf1ScA = addSp(s.ptE1.id, s.ptLf1ScA.id, "hidden");
    s.spLf1ScB = addSp(s.ptB1.id, s.ptLf1ScA.id, "hidden");
    s.spLf1ScC = addSp(s.ptLf1ScA.id, s.ptLf1ScB.id, "hidden");
    s.spLf1ScD = addSp(s.ptLf1ScB.id, s.ptLf1.id, "hidden");
    //(leaf 2)
    s.spLf2ScA = addSp(s.ptE2.id, s.ptLf2ScA.id, "hidden");
    s.spLf2ScB = addSp(s.ptB2.id, s.ptLf2ScA.id, "hidden");
    s.spLf2ScC = addSp(s.ptLf2ScA.id, s.ptLf2ScB.id, "hidden");
    s.spLf2ScD = addSp(s.ptLf2ScB.id, s.ptLf2.id, "hidden");
    s.hasLeafScaffolding = true;
}

///grows leaves
function growLeaves(plant, segment) {
    var p = plant;
    var s = segment;
    if (s.spLf1.l < p.maxLeaflength) {
        //extend leaves
        s.spLf1.l = s.spLf2.l += p.leafGrowthRate;
        if (s.spF.l > p.maxSegmentWidth * 0.6 && !s.hasLeafScaffolding) {
            // add scaffolding when leaves unfold
            addLeafScaffolding(plant, segment);
        } else if (s.hasLeafScaffolding) {
            //extend scaffolding if present
            //(leaf 1)
            s.spLf1ScA.l += p.leafGrowthRate * 1.25;
            s.spLf1ScB.l += p.leafGrowthRate * 1.5;
            s.spLf1ScC.l += p.leafGrowthRate * 0.06;
            s.spLf1ScD.l += p.leafGrowthRate * 0.06;
            //(leaf 2)
            s.spLf2ScA.l += p.leafGrowthRate * 1.25;
            s.spLf2ScB.l += p.leafGrowthRate * 1.5;
            s.spLf2ScC.l += p.leafGrowthRate * 0.06;
            s.spLf2ScD.l += p.leafGrowthRate * 0.06;
        }
    }
}

///renders leaf
function renderLeaf(plant, leafSpan) {
    var p1x = leafSpan.p1.cx;
    var p1y = leafSpan.p1.cy;
    var p2x = leafSpan.p2.cx;
    var p2y = leafSpan.p2.cy;
    var mpx = (p1x + p2x) / 2; // mid point x
    var mpy = (p1y + p2y) / 2; // mid point y
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#003000";
    ctx.fillStyle = "green";
    var ah = 0.35; // arc height
    //leaf top
    var ccpx = mpx + (p2y - p1y) * ah; // curve control point x
    var ccpy = mpy + (p1x - p2x) * ah; // curve control point y
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.quadraticCurveTo(ccpx, ccpy, p2x, p2y);
    ctx.stroke();
    ctx.fill();
    //leaf bottom
    ccpx = mpx + (p1y - p2y) * ah; // curve control point x
    ccpy = mpy + (p2x - p1x) * ah; // curve control point y
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.quadraticCurveTo(ccpx, ccpy, p2x, p2y);
    ctx.stroke();
    ctx.fill();
    //leaf center
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#007000";
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();
}

///renders leaves
function renderLeaves(plant, segment) {
    if (segment.hasLeaves) {
        renderLeaf(plant, segment.spLf1);
        renderLeaf(plant, segment.spLf2);
        if (viewShadows) {
            markShadowPositions(segment);
        }
    }
}

///renders stalks
function renderStalks(plant, segment) {
    for (var i = 0; i < segment.skins.length; i++) {
        var s = segment.skins[i];
        //fills
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "darkgreen";
        ctx.moveTo(s.points[0].cx, s.points[0].cy);
        for (var j = 1; j < s.points.length; j++) {
            ctx.lineTo(s.points[j].cx, s.points[j].cy);
        }
        ctx.lineTo(s.points[0].cx, s.points[0].cy);
        ctx.stroke();
        ctx.fill();
        //outlines
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#2A2000";
        ctx.moveTo(s.points[3].cx, s.points[3].cy);
        ctx.lineTo(s.points[0].cx, s.points[0].cy);
        ctx.moveTo(s.points[2].cx, s.points[2].cy);
        ctx.lineTo(s.points[1].cx, s.points[1].cy);
        ctx.stroke();
        if (!segment.hasChildSegment) {
            ctx.beginPath();
            ctx.moveTo(s.points[3].cx, s.points[3].cy);
            ctx.lineTo(s.points[2].cx, s.points[2].cy);
            ctx.stroke();
        }
    }
}

///renders plants (sequentially)
function renderPlants() {
    for (var i = 0; i < plants.length; i++) {
        for (var j = 0; j < plants[i].segments.length; j++) {
            var plant = plants[i];
            var segment = plants[i].segments[j];
            renderStalks(plant, segment);
            renderLeaves(plant, segment);
        }
    }
}

///renders shadows (from highest to lowest elevation)
function renderShadows() {
    shadows.sort(function (a, b) {
        return a.p2.cy - b.p2.cy
    });
    for (var i = 0; i < shadows.length; i++) {
        var sh = shadows[i];
        ctx.beginPath();
        ctx.moveTo(sh.p1.cx, sh.p1.cy);
        ctx.lineTo(sh.p2.cx, sh.p2.cy);
        ctx.lineTo(sh.p3.cx, sh.p3.cy);
        ctx.lineTo(sh.p4.cx, sh.p4.cy);
        ctx.lineTo(sh.p1.cx, sh.p1.cy);
        ctx.fillStyle = "rgba( 0, 0, 0, 0.1 )";
        ctx.fill();
    }
    //resets shadows
    shadows = [];
    shadowCount = 0;
}




////---DISPLAY---////

for (var i = 0; i < 25; i++) {
    createPlant();
}

function display() {
    runVerlet();
    if (worldTime % worldSpeed === 0) {
        growPlants();
    }
    renderPlants();
    shedSunlight();
    renderShadows();
    window.requestAnimationFrame(display);
}

createSunRays();
display();
