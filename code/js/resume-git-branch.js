/***********************
 *  CUSTOM TEMPLATES   *
 ***********************/

var myTemplateConfig = {
    // branch colors (one per column)
    colors: ["#4af", "#6b9", "#9d6", "#f75", "#fa5", "#b8f", "#daf", "#baf", "#e8f"],

    branch: {
        lineWidth: 4,
        spacingX: 32,
        showLabel: true,
        labelFont: "bold 11pt Helvetica"
    },
    commit: {
        spacingY: -42,
        dot: {
            size: 10,
            color: "white",
            strokeWidth: 8,
        },
        message: {
            displayAuthor: true,
            displayBranch: true,
            displayHash: false,
            font: "bold 13pt Courier",
        },
        tooltipHTMLFormatter: function (commit) {
            return "<b>" + commit.sha1 + "</b>" + ": " + commit.message;
        }
    }
};
var myTemplate = new GitGraph.Template(myTemplateConfig);

/***********************
 *    INITIALIZATION   *
 ***********************/

var config = {
    template: myTemplate,
};
var gitGraph = new GitGraph(config);

/***********************
 * BRANCHS AND COMMITS *
 ***********************/

// create master branch
var master = gitGraph.branch("master");

// create commit on master branch
master.commit({
    message: "Stable Release",
    author: "ADMIN"
});

// start NEW PRODUCT
var navio53base = master.branch("navio5.3/base");

navio53base.commit({
    dotColor: "#173",
    message: "Start new product",
    author: "INTEGRATORS"
});
// start and develop NEW FEATURE
var navio53featureA = navio53base.branch("navio5.3/features/A");

navio53featureA.commit({
    message: "Start and develop new feature A",
    author: "DEVELOPERS"
});

// merge feature into product
navio53featureA.merge(navio53base, {
    message: "Merge feature A into product",
    author: "INTEGRATORS"
});
// merge product into master
navio53base.merge(master, {
    dotColor: "#0f0",
    message: "Merge product into master",
    author: "INTEGRATORS"
});

// create NEW RELEASE branch
var relaseN53 = master.branch({
    name: "release/N/5.3",
    column: 1
});

relaseN53.commit({
    dotColor: "#173",
    message: "Create realease branch",
    author: "INTEGRATORS"
});

// start NEW PRODUCT
var navio60base = master.branch("navio6.0/base")

navio60base.commit({
    dotColor: "#b53",
    message: "Start new product",
    author: "INTEGRATORS"
});

var navio60featureA = navio60base.branch("navio6.0/features/A");

navio60featureA.commit({
    message: "Start and develop new feature A",
    author: "DEVELOPERS"
});

// start NEW PRODUCT
var optimus10base = navio60base.branch("optimus/base");

optimus10base.commit({
    dotColor: "#64a",
    message: "Start new product",
    author: "INTEGRATORS"
});

navio60featureA.merge(navio60base, {
    message: "Merge feature A into product",
    author: "INTEGRATORS"
});

var optimus10featureA = optimus10base.branch("optimus/features/A")

optimus10featureA.commit({
    message: "Start and develop new feature A",
    author: "DEVELOPERS"
});

var optimus10featureB = optimus10base.branch("optimus/features/B")

optimus10featureB.commit({
    message: "Start and develop new feature B",
    author: "DEVELOPERS"
});

optimus10featureA.merge(optimus10base, {
    message: "Merge feature A into product",
    author: "INTEGRATORS"
});

optimus10base.merge(optimus10featureB, {
    message: "Pull product changes into feature B",
    author: "INTEGRATORS"
});

navio60base.merge(master, {
    dotColor: "#fa0",
    message: "Merge product into master",
    author: "INTEGRATORS"
})

// create NEW RELEASE branch
var relaseN60 = master.branch({
    name: "release/N/6.0",
    column: 3
});

relaseN60.commit({
    dotColor: "#b53",
    message: "Create realease branch",
    author: "INTEGRATORS"
});

master.merge(optimus10base, {
    message: "Pull stable changes into product",
    author: "INTEGRATORS"
});

optimus10base.merge(optimus10featureB, {
    message: "Pull product changes into feature B",
    author: "INTEGRATORS"
});

var optimus10featureC = optimus10base.branch("optimus/features/C")

optimus10featureC.commit({
    message: "Start and develop new feature C",
    author: "DEVELOPERS"
});
optimus10featureC.merge(optimus10base, {
    message: "Merge feature C into product",
    author: "INTEGRATORS"
});

optimus10featureB.merge(optimus10base, {
    message: "Merge feature B into product",
    author: "INTEGRATORS"
});

optimus10base.merge(master, {
    dotColor: "#b8f",
    message: "Merge product into stable realease",
    author: "INTEGRATORS"
});

// create NEW RELEASE branch
var relaseO10 = master.branch({
    name: "release/O/1.0",
    column: 5
});

relaseO10.commit({
    dotColor: "#64a",
    message: "Create realease branch",
    author: "INTEGRATORS"
});

console.log('git branch');
