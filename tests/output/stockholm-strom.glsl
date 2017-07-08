
// pushing activation record 
/* DEF: iResolution *//* DEF: iSampleRate *//* DEF: iGlobalTime *//* DEF: iTime *//* DEF: iTimeDelta *//* DEF: iFrame *//* DEF: iChannelTime *//* DEF: iMouse *//* DEF: iDate *//* DEF: iChannelResolution *//* DEF: vec2 *//* DEF: vec3 *//* DEF: vec4 *//* DEF: mat2 *//* DEF: mat3 *//* DEF: mat4 *//* DEF: ivec2 *//* DEF: ivec3 *//* DEF: ivec4 *//* DEF: bvec2 *//* DEF: bvec3 *//* DEF: bvec4 *//* DEF: + *//* DEF: - *//* DEF: * *//* DEF: / *//* DEF: < *//* DEF: > *//* DEF: <= *//* DEF: >= *//* DEF: == *//* DEF: ++ *//* DEF: -- *//* DEF: && *//* DEF: || *//* DEF: ^^ *//* DEF: ! *//* DEF: ? *//* DEF: matrixCompMult *//* DEF: all *//* DEF: any *//* DEF: equal *//* DEF: greaterThan *//* DEF: greaterThanEqual *//* DEF: lessThan *//* DEF: lessThanEqual *//* DEF: not *//* DEF: notEqual *//* DEF: ftransform *//* DEF: cross *//* DEF: distance *//* DEF: dot *//* DEF: faceforward *//* DEF: length *//* DEF: normalize *//* DEF: reflect *//* DEF: refract *//* DEF: sin *//* DEF: cos *//* DEF: tan *//* DEF: asin *//* DEF: acos *//* DEF: atan *//* DEF: radians *//* DEF: degrees *//* DEF: abs *//* DEF: ceil *//* DEF: clamp *//* DEF: floor *//* DEF: fract *//* DEF: max *//* DEF: min *//* DEF: mix *//* DEF: mod *//* DEF: sign *//* DEF: smoothstep *//* DEF: step *//* DEF: pow *//* DEF: exp *//* DEF: log *//* DEF: exp2 *//* DEF: log2 *//* DEF: sqrt *//* DEF: inversesqrt *//* DEF: dFdx *//* DEF: dFdy *//* DEF: fwidth *//* DEF: texture1D *//* DEF: texture1DProj *//* DEF: texture2D *//* DEF: texture2DProj *//* DEF: texture3D *//* DEF: texture3DProj *//* DEF: textureCube *//* DEF: shadow1D *//* DEF: shadow2D *//* DEF: shadow1DProj *//* DEF: shadow2DProj *//* DEF: texture1DLod *//* DEF: texture1DProjLod *//* DEF: texture2DLod *//* DEF: texture2DProjLod *//* DEF: texture3DProjLod *//* DEF: textureCubeLod *//* DEF: shadow1DLod *//* DEF: shadow2DLod *//* DEF: shadow1DProjLod *//* DEF: shadow2DProjLod *//* DEF: noise1 *//* DEF: noise2 *//* DEF: noise3 *//* DEF: noise4 *//* DEF: rotationMatrix */
// pushing activation record 0:rotationMatrix
mat3 rotationMatrix(vec3 /* DEF: axis */axis, float /* DEF: angle */angle){

    // pushing activation record 0:rotationMatrix1:
    /* REF: axis*/axis = /* REF: normalize*/normalize(/* REF: axis*/axis);
    float /* DEF: s */s = /* REF: sin*/sin(/* REF: angle*/angle);
    float /* DEF: c */c = /* REF: cos*/cos(/* REF: angle*/angle);
    float /* DEF: oc */oc = 1.0 - /* REF: c*/c;
    return /* REF: mat3*/mat3(/* REF: oc*/oc * /* REF: axis*/axis.x * /* REF: axis*/axis.x + /* REF: c*/c, /* REF: oc*/oc * /* REF: axis*/axis.x * /* REF: axis*/axis.y - /* REF: axis*/axis.z * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.z * /* REF: axis*/axis.x + /* REF: axis*/axis.y * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.x * /* REF: axis*/axis.y + /* REF: axis*/axis.z * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.y * /* REF: axis*/axis.y + /* REF: c*/c, /* REF: oc*/oc * /* REF: axis*/axis.y * /* REF: axis*/axis.z - /* REF: axis*/axis.x * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.z * /* REF: axis*/axis.x - /* REF: axis*/axis.y * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.y * /* REF: axis*/axis.z + /* REF: axis*/axis.x * /* REF: s*/s, /* REF: oc*/oc * /* REF: axis*/axis.z * /* REF: axis*/axis.z + /* REF: c*/c);
    }
// popping activation record 0:rotationMatrix1:
// local variables: 
// variable s, unique name 0:rotationMatrix1::s, index 115, declared at line 10, column 10
// variable c, unique name 0:rotationMatrix1::c, index 116, declared at line 11, column 10
// variable oc, unique name 0:rotationMatrix1::oc, index 117, declared at line 12, column 10
// references:
// axis at line 9, column 4
// normalize at line 9, column 11
// axis at line 9, column 21
// sin at line 10, column 14
// angle at line 10, column 18
// cos at line 11, column 14
// angle at line 11, column 18
// c at line 12, column 21
// mat3 at line 14, column 11
// oc at line 14, column 16
// axis at line 14, column 21
// axis at line 14, column 30
// c at line 14, column 39
// oc at line 14, column 52
// axis at line 14, column 57
// axis at line 14, column 66
// axis at line 14, column 75
// s at line 14, column 84
// oc at line 14, column 88
// axis at line 14, column 93
// axis at line 14, column 102
// axis at line 14, column 111
// s at line 14, column 120
// oc at line 15, column 16
// axis at line 15, column 21
// axis at line 15, column 30
// axis at line 15, column 39
// s at line 15, column 48
// oc at line 15, column 52
// axis at line 15, column 57
// axis at line 15, column 66
// c at line 15, column 75
// oc at line 15, column 88
// axis at line 15, column 93
// axis at line 15, column 102
// axis at line 15, column 111
// s at line 15, column 120
// oc at line 16, column 16
// axis at line 16, column 21
// axis at line 16, column 30
// axis at line 16, column 39
// s at line 16, column 48
// oc at line 16, column 52
// axis at line 16, column 57
// axis at line 16, column 66
// axis at line 16, column 75
// s at line 16, column 84
// oc at line 16, column 88
// axis at line 16, column 93
// axis at line 16, column 102
// c at line 16, column 111
// popping activation record 0:rotationMatrix
// local variables: 
// variable axis, unique name 0:rotationMatrix:axis, index 113, declared at line 7, column 25
// variable angle, unique name 0:rotationMatrix:angle, index 114, declared at line 7, column 37
// references:
/* DEF: mod289 */
// pushing activation record 0:mod289
vec3 mod289(vec3 /* DEF: x */x){

    // pushing activation record 0:mod2893:
    return /* REF: x*/x - /* REF: floor*/floor(/* REF: x*/x * (1.0 / 289.0)) * 289.0;
    }
// popping activation record 0:mod2893:
// local variables: 
// references:
// x at line 34, column 9
// floor at line 34, column 13
// x at line 34, column 19
// popping activation record 0:mod289
// local variables: 
// variable x, unique name 0:mod289:x, index 119, declared at line 33, column 17
// references:
/* DEF: mod289 */// ERROR: Trying to define a new variable with same unique name :mod289 at line 33, column 0
// ERROR: Found a variable in current frame with same name mod289 at line 33, column 0

// pushing activation record 0:mod289
vec4 mod289(vec4 /* DEF: x */// ERROR: Trying to define a new variable with same unique name 0:mod289:x at line 33, column 17
x){

    // pushing activation record 0:mod2895:
    return /* REF: x*/x - /* REF: floor*/floor(/* REF: x*/x * (1.0 / 289.0)) * 289.0;
    }
// popping activation record 0:mod2895:
// local variables: 
// references:
// x at line 38, column 9
// floor at line 38, column 13
// x at line 38, column 19
// popping activation record 0:mod289
// local variables: 
// variable x, unique name 0:mod289:x, index 120, declared at line 37, column 17
// references:
/* DEF: permute */
// pushing activation record 0:permute
vec4 permute(vec4 /* DEF: x */x){

    // pushing activation record 0:permute7:
    return /* REF: mod289*/mod289(((/* REF: x*/x * 34.0) + 1.0) * /* REF: x*/x);
    }
// popping activation record 0:permute7:
// local variables: 
// references:
// mod289 at line 42, column 12
// x at line 42, column 21
// x at line 42, column 34
// popping activation record 0:permute
// local variables: 
// variable x, unique name 0:permute:x, index 121, declared at line 41, column 18
// references:
/* DEF: taylorInvSqrt */
// pushing activation record 0:taylorInvSqrt
vec4 taylorInvSqrt(vec4 /* DEF: r */r){

    // pushing activation record 0:taylorInvSqrt9:
    return 1.79284291400159 - 0.85373472095314 * /* REF: r*/r;
    }
// popping activation record 0:taylorInvSqrt9:
// local variables: 
// references:
// r at line 47, column 47
// popping activation record 0:taylorInvSqrt
// local variables: 
// variable r, unique name 0:taylorInvSqrt:r, index 123, declared at line 45, column 24
// references:
/* DEF: noise */
// pushing activation record 0:noise
float noise(vec3 /* DEF: v */v){

    // pushing activation record 0:noise11:
    const vec2 /* DEF: C */C = /* REF: vec2*/vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 /* DEF: D */D = /* REF: vec4*/vec4(0.0, 0.5, 1.0, 2.0);
    vec3 /* DEF: i */i = /* REF: floor*/floor(/* REF: v*/v + /* REF: dot*/dot(/* REF: v*/v, /* REF: C*/C.yyy));
    vec3 /* DEF: x0 */x0 = /* REF: v*/v - /* REF: i*/i + /* REF: dot*/dot(/* REF: i*/i, /* REF: C*/C.xxx);
    vec3 /* DEF: g */g = /* REF: step*/step(/* REF: x0*/x0.yzx, /* REF: x0*/x0.xyz);
    vec3 /* DEF: l */l = 1.0 - /* REF: g*/g;
    vec3 /* DEF: i1 */i1 = /* REF: min*/min(/* REF: g*/g.xyz, /* REF: l*/l.zxy);
    vec3 /* DEF: i2 */i2 = /* REF: max*/max(/* REF: g*/g.xyz, /* REF: l*/l.zxy);
    vec3 /* DEF: x1 */x1 = /* REF: x0*/x0 - /* REF: i1*/i1 + /* REF: C*/C.xxx;
    vec3 /* DEF: x2 */x2 = /* REF: x0*/x0 - /* REF: i2*/i2 + /* REF: C*/C.yyy;
    vec3 /* DEF: x3 */x3 = /* REF: x0*/x0 - /* REF: D*/D.yyy;
    /* REF: i*/i = /* REF: mod289*/mod289(/* REF: i*/i);
    vec4 /* DEF: p */p = /* REF: permute*/permute(/* REF: permute*/permute(/* REF: permute*/permute(/* REF: i*/i.z + /* REF: vec4*/vec4(0.0, /* REF: i1*/i1.z, /* REF: i2*/i2.z, 1.0)) + /* REF: i*/i.y + /* REF: vec4*/vec4(0.0, /* REF: i1*/i1.y, /* REF: i2*/i2.y, 1.0)) + /* REF: i*/i.x + /* REF: vec4*/vec4(0.0, /* REF: i1*/i1.x, /* REF: i2*/i2.x, 1.0));
    float /* DEF: n_ */n_ = 0.142857142857;
    vec3 /* DEF: ns */ns = /* REF: n_*/n_ * /* REF: D*/D.wyz - /* REF: D*/D.xzx;
    vec4 /* DEF: j */j = /* REF: p*/p - 49.0 * /* REF: floor*/floor(/* REF: p*/p * /* REF: ns*/ns.z * /* REF: ns*/ns.z);
    vec4 /* DEF: x_ */x_ = /* REF: floor*/floor(/* REF: j*/j * /* REF: ns*/ns.z);
    vec4 /* DEF: y_ */y_ = /* REF: floor*/floor(/* REF: j*/j - 7.0 * /* REF: x_*/x_);
    vec4 /* DEF: x */x = /* REF: x_*/x_ * /* REF: ns*/ns.x + /* REF: ns*/ns.yyyy;
    vec4 /* DEF: y */y = /* REF: y_*/y_ * /* REF: ns*/ns.x + /* REF: ns*/ns.yyyy;
    vec4 /* DEF: h */h = 1.0 - /* REF: abs*/abs(/* REF: x*/x) - /* REF: abs*/abs(/* REF: y*/y);
    vec4 /* DEF: b0 */b0 = /* REF: vec4*/vec4(/* REF: x*/x.xy, /* REF: y*/y.xy);
    vec4 /* DEF: b1 */b1 = /* REF: vec4*/vec4(/* REF: x*/x.zw, /* REF: y*/y.zw);
    vec4 /* DEF: s0 */s0 = /* REF: floor*/floor(/* REF: b0*/b0) * 2.0 + 1.0;
    vec4 /* DEF: s1 */s1 = /* REF: floor*/floor(/* REF: b1*/b1) * 2.0 + 1.0;
    vec4 /* DEF: sh */sh = -/* REF: step*/step(/* REF: h*/h, /* REF: vec4*/vec4(0.0));
    vec4 /* DEF: a0 */a0 = /* REF: b0*/b0.xzyw + /* REF: s0*/s0.xzyw * /* REF: sh*/sh.xxyy;
    vec4 /* DEF: a1 */a1 = /* REF: b1*/b1.xzyw + /* REF: s1*/s1.xzyw * /* REF: sh*/sh.zzww;
    vec3 /* DEF: p0 */p0 = /* REF: vec3*/vec3(/* REF: a0*/a0.xy, /* REF: h*/h.x);
    vec3 /* DEF: p1 */p1 = /* REF: vec3*/vec3(/* REF: a0*/a0.zw, /* REF: h*/h.y);
    vec3 /* DEF: p2 */p2 = /* REF: vec3*/vec3(/* REF: a1*/a1.xy, /* REF: h*/h.z);
    vec3 /* DEF: p3 */p3 = /* REF: vec3*/vec3(/* REF: a1*/a1.zw, /* REF: h*/h.w);
    vec4 /* DEF: norm */norm = /* REF: taylorInvSqrt*/taylorInvSqrt(/* REF: vec4*/vec4(/* REF: dot*/dot(/* REF: p0*/p0, /* REF: p0*/p0), /* REF: dot*/dot(/* REF: p1*/p1, /* REF: p1*/p1), /* REF: dot*/dot(/* REF: p2*/p2, /* REF: p2*/p2), /* REF: dot*/dot(/* REF: p3*/p3, /* REF: p3*/p3)));
    /* REF: p0*/p0 *= /* REF: norm*/norm.x;
    /* REF: p1*/p1 *= /* REF: norm*/norm.y;
    /* REF: p2*/p2 *= /* REF: norm*/norm.z;
    /* REF: p3*/p3 *= /* REF: norm*/norm.w;
    vec4 /* DEF: m */m = /* REF: max*/max(0.6 - /* REF: vec4*/vec4(/* REF: dot*/dot(/* REF: x0*/x0, /* REF: x0*/x0), /* REF: dot*/dot(/* REF: x1*/x1, /* REF: x1*/x1), /* REF: dot*/dot(/* REF: x2*/x2, /* REF: x2*/x2), /* REF: dot*/dot(/* REF: x3*/x3, /* REF: x3*/x3)), 0.0);
    /* REF: m*/m = /* REF: m*/m * /* REF: m*/m;
    return 42.0 * /* REF: dot*/dot(/* REF: m*/m * /* REF: m*/m, /* REF: vec4*/vec4(/* REF: dot*/dot(/* REF: p0*/p0, /* REF: x0*/x0), /* REF: dot*/dot(/* REF: p1*/p1, /* REF: x1*/x1), /* REF: dot*/dot(/* REF: p2*/p2, /* REF: x2*/x2), /* REF: dot*/dot(/* REF: p3*/p3, /* REF: x3*/x3)));
    }
// popping activation record 0:noise11:
// local variables: 
// variable C, unique name 0:noise11::C, index 126, declared at line 52, column 14
// variable D, unique name 0:noise11::D, index 127, declared at line 53, column 14
// variable i, unique name 0:noise11::i, index 128, declared at line 56, column 7
// variable x0, unique name 0:noise11::x0, index 129, declared at line 57, column 7
// variable g, unique name 0:noise11::g, index 130, declared at line 60, column 7
// variable l, unique name 0:noise11::l, index 131, declared at line 61, column 7
// variable i1, unique name 0:noise11::i1, index 132, declared at line 62, column 7
// variable i2, unique name 0:noise11::i2, index 133, declared at line 63, column 7
// variable x1, unique name 0:noise11::x1, index 134, declared at line 69, column 7
// variable x2, unique name 0:noise11::x2, index 135, declared at line 70, column 7
// variable x3, unique name 0:noise11::x3, index 136, declared at line 71, column 7
// variable p, unique name 0:noise11::p, index 137, declared at line 75, column 7
// variable n_, unique name 0:noise11::n_, index 138, declared at line 82, column 8
// variable ns, unique name 0:noise11::ns, index 139, declared at line 83, column 8
// variable j, unique name 0:noise11::j, index 140, declared at line 85, column 7
// variable x_, unique name 0:noise11::x_, index 141, declared at line 87, column 7
// variable y_, unique name 0:noise11::y_, index 142, declared at line 88, column 7
// variable x, unique name 0:noise11::x, index 143, declared at line 90, column 7
// variable y, unique name 0:noise11::y, index 144, declared at line 91, column 7
// variable h, unique name 0:noise11::h, index 145, declared at line 92, column 7
// variable b0, unique name 0:noise11::b0, index 146, declared at line 94, column 7
// variable b1, unique name 0:noise11::b1, index 147, declared at line 95, column 7
// variable s0, unique name 0:noise11::s0, index 148, declared at line 99, column 7
// variable s1, unique name 0:noise11::s1, index 149, declared at line 100, column 7
// variable sh, unique name 0:noise11::sh, index 150, declared at line 101, column 7
// variable a0, unique name 0:noise11::a0, index 151, declared at line 103, column 7
// variable a1, unique name 0:noise11::a1, index 152, declared at line 104, column 7
// variable p0, unique name 0:noise11::p0, index 153, declared at line 106, column 7
// variable p1, unique name 0:noise11::p1, index 154, declared at line 107, column 7
// variable p2, unique name 0:noise11::p2, index 155, declared at line 108, column 7
// variable p3, unique name 0:noise11::p3, index 156, declared at line 109, column 7
// variable norm, unique name 0:noise11::norm, index 157, declared at line 112, column 7
// variable m, unique name 0:noise11::m, index 158, declared at line 119, column 7
// references:
// vec2 at line 52, column 18
// vec4 at line 53, column 18
// floor at line 56, column 12
// v at line 56, column 18
// dot at line 56, column 22
// v at line 56, column 26
// C at line 56, column 29
// v at line 57, column 14
// i at line 57, column 18
// dot at line 57, column 22
// i at line 57, column 26
// C at line 57, column 29
// step at line 60, column 11
// x0 at line 60, column 16
// x0 at line 60, column 24
// g at line 61, column 17
// min at line 62, column 12
// g at line 62, column 17
// l at line 62, column 24
// max at line 63, column 12
// g at line 63, column 17
// l at line 63, column 24
// x0 at line 69, column 12
// i1 at line 69, column 17
// C at line 69, column 22
// x0 at line 70, column 12
// i2 at line 70, column 17
// C at line 70, column 22
// x0 at line 71, column 12
// D at line 71, column 17
// i at line 74, column 2
// mod289 at line 74, column 6
// i at line 74, column 13
// permute at line 75, column 11
// permute at line 75, column 20
// permute at line 75, column 29
// i at line 76, column 13
// vec4 at line 76, column 19
// i1 at line 76, column 29
// i2 at line 76, column 35
// i at line 77, column 13
// vec4 at line 77, column 19
// i1 at line 77, column 29
// i2 at line 77, column 35
// i at line 78, column 13
// vec4 at line 78, column 19
// i1 at line 78, column 29
// i2 at line 78, column 35
// n_ at line 83, column 13
// D at line 83, column 18
// D at line 83, column 26
// p at line 85, column 11
// floor at line 85, column 22
// p at line 85, column 28
// ns at line 85, column 32
// ns at line 85, column 39
// floor at line 87, column 12
// j at line 87, column 18
// ns at line 87, column 22
// floor at line 88, column 12
// j at line 88, column 18
// x_ at line 88, column 28
// x_ at line 90, column 11
// ns at line 90, column 15
// ns at line 90, column 22
// y_ at line 91, column 11
// ns at line 91, column 15
// ns at line 91, column 22
// abs at line 92, column 17
// x at line 92, column 21
// abs at line 92, column 26
// y at line 92, column 30
// vec4 at line 94, column 12
// x at line 94, column 18
// y at line 94, column 24
// vec4 at line 95, column 12
// x at line 95, column 18
// y at line 95, column 24
// floor at line 99, column 12
// b0 at line 99, column 18
// floor at line 100, column 12
// b1 at line 100, column 18
// step at line 101, column 13
// h at line 101, column 18
// vec4 at line 101, column 21
// b0 at line 103, column 12
// s0 at line 103, column 22
// sh at line 103, column 30
// b1 at line 104, column 12
// s1 at line 104, column 22
// sh at line 104, column 30
// vec3 at line 106, column 12
// a0 at line 106, column 17
// h at line 106, column 23
// vec3 at line 107, column 12
// a0 at line 107, column 17
// h at line 107, column 23
// vec3 at line 108, column 12
// a1 at line 108, column 17
// h at line 108, column 23
// vec3 at line 109, column 12
// a1 at line 109, column 17
// h at line 109, column 23
// taylorInvSqrt at line 112, column 14
// vec4 at line 112, column 28
// dot at line 112, column 33
// p0 at line 112, column 37
// p0 at line 112, column 40
// dot at line 112, column 45
// p1 at line 112, column 49
// p1 at line 112, column 52
// dot at line 112, column 57
// p2 at line 112, column 61
// p2 at line 112, column 65
// dot at line 112, column 70
// p3 at line 112, column 74
// p3 at line 112, column 77
// p0 at line 113, column 2
// norm at line 113, column 8
// p1 at line 114, column 2
// norm at line 114, column 8
// p2 at line 115, column 2
// norm at line 115, column 8
// p3 at line 116, column 2
// norm at line 116, column 8
// max at line 119, column 11
// vec4 at line 119, column 21
// dot at line 119, column 26
// x0 at line 119, column 30
// x0 at line 119, column 33
// dot at line 119, column 38
// x1 at line 119, column 42
// x1 at line 119, column 45
// dot at line 119, column 50
// x2 at line 119, column 54
// x2 at line 119, column 57
// dot at line 119, column 62
// x3 at line 119, column 66
// x3 at line 119, column 69
// m at line 120, column 2
// m at line 120, column 6
// m at line 120, column 10
// dot at line 121, column 16
// m at line 121, column 21
// m at line 121, column 23
// vec4 at line 121, column 26
// dot at line 121, column 32
// p0 at line 121, column 36
// x0 at line 121, column 39
// dot at line 121, column 44
// p1 at line 121, column 48
// x1 at line 121, column 51
// dot at line 122, column 32
// p2 at line 122, column 36
// x2 at line 122, column 39
// dot at line 122, column 44
// p3 at line 122, column 48
// x3 at line 122, column 51
// popping activation record 0:noise
// local variables: 
// variable v, unique name 0:noise:v, index 125, declared at line 50, column 17
// references:
/* DEF: fnoise */
// pushing activation record 0:fnoise
float fnoise(vec3 /* DEF: p */p){

    // pushing activation record 0:fnoise13:
    mat3 /* DEF: rot */rot = /* REF: rotationMatrix*/rotationMatrix(/* REF: normalize*/normalize(/* REF: vec3*/vec3(0.0, 0.0, 1.0)), 0.5 * /* REF: iGlobalTime*/iGlobalTime);
    mat3 /* DEF: rot2 */rot2 = /* REF: rotationMatrix*/rotationMatrix(/* REF: normalize*/normalize(/* REF: vec3*/vec3(0.0, 0.0, 1.0)), 0.3 * /* REF: iGlobalTime*/iGlobalTime);
    float /* DEF: sum */sum = 0.0;
    vec3 /* DEF: r */r = /* REF: rot*/rot * /* REF: p*/p;
    float /* DEF: add */add = /* REF: noise*/noise(/* REF: r*/r);
    float /* DEF: msc */msc = /* REF: add*/add + 0.7;
    /* REF: msc*/msc = /* REF: clamp*/clamp(/* REF: msc*/msc, 0.0, 1.0);
    /* REF: sum*/sum += 0.6 * /* REF: add*/add;
    /* REF: p*/p = /* REF: p*/p * 2.0;
    /* REF: r*/r = /* REF: rot*/rot * /* REF: p*/p;
    /* REF: add*/add = /* REF: noise*/noise(/* REF: r*/r);
    /* REF: add*/add *= /* REF: msc*/msc;
    /* REF: sum*/sum += 0.5 * /* REF: add*/add;
    /* REF: msc*/msc *= /* REF: add*/add + 0.7;
    /* REF: msc*/msc = /* REF: clamp*/clamp(/* REF: msc*/msc, 0.0, 1.0);
    /* REF: p*/p.xy = /* REF: p*/p.xy * 2.0;
    /* REF: p*/p = /* REF: rot2*/rot2 * /* REF: p*/p;
    /* REF: add*/add = /* REF: noise*/noise(/* REF: p*/p);
    /* REF: add*/add *= /* REF: msc*/msc;
    /* REF: sum*/sum += 0.25 * /* REF: abs*/abs(/* REF: add*/add);
    /* REF: msc*/msc *= /* REF: add*/add + 0.7;
    /* REF: msc*/msc = /* REF: clamp*/clamp(/* REF: msc*/msc, 0.0, 1.0);
    /* REF: p*/p = /* REF: p*/p * 2.0;
    /* REF: add*/add = /* REF: noise*/noise(/* REF: p*/p);
    /* REF: add*/add *= /* REF: msc*/msc;
    /* REF: sum*/sum += 0.125 * /* REF: abs*/abs(/* REF: add*/add);
    /* REF: msc*/msc *= /* REF: add*/add + 0.2;
    /* REF: msc*/msc = /* REF: clamp*/clamp(/* REF: msc*/msc, 0.0, 1.0);
    /* REF: p*/p = /* REF: p*/p * 2.0;
    /* REF: add*/add = /* REF: noise*/noise(/* REF: p*/p);
    /* REF: add*/add *= /* REF: msc*/msc;
    /* REF: sum*/sum += 0.0625 * /* REF: abs*/abs(/* REF: add*/add);
    return /* REF: sum*/sum * 0.516129;
    }
// popping activation record 0:fnoise13:
// local variables: 
// variable rot, unique name 0:fnoise13::rot, index 161, declared at line 145, column 9
// variable rot2, unique name 0:fnoise13::rot2, index 162, declared at line 146, column 9
// variable sum, unique name 0:fnoise13::sum, index 163, declared at line 147, column 10
// variable r, unique name 0:fnoise13::r, index 164, declared at line 149, column 9
// variable add, unique name 0:fnoise13::add, index 165, declared at line 151, column 10
// variable msc, unique name 0:fnoise13::msc, index 166, declared at line 152, column 10
// references:
// rotationMatrix at line 145, column 15
// normalize at line 145, column 31
// vec3 at line 145, column 41
// iGlobalTime at line 145, column 66
// rotationMatrix at line 146, column 16
// normalize at line 146, column 32
// vec3 at line 146, column 42
// iGlobalTime at line 146, column 67
// rot at line 149, column 13
// p at line 149, column 17
// noise at line 151, column 16
// r at line 151, column 22
// add at line 152, column 16
// msc at line 153, column 4
// clamp at line 153, column 10
// msc at line 153, column 16
// sum at line 154, column 4
// add at line 154, column 15
// p at line 156, column 4
// p at line 156, column 8
// r at line 157, column 4
// rot at line 157, column 8
// p at line 157, column 12
// add at line 158, column 4
// noise at line 158, column 10
// r at line 158, column 16
// add at line 160, column 4
// msc at line 160, column 11
// sum at line 161, column 4
// add at line 161, column 15
// msc at line 162, column 4
// add at line 162, column 11
// msc at line 163, column 4
// clamp at line 163, column 10
// msc at line 163, column 16
// p at line 165, column 4
// p at line 165, column 11
// p at line 166, column 4
// rot2 at line 166, column 8
// p at line 166, column 14
// add at line 167, column 4
// noise at line 167, column 10
// p at line 167, column 16
// add at line 168, column 4
// msc at line 168, column 11
// sum at line 169, column 4
// abs at line 169, column 16
// add at line 169, column 20
// msc at line 170, column 4
// add at line 170, column 11
// msc at line 171, column 4
// clamp at line 171, column 10
// msc at line 171, column 16
// p at line 173, column 4
// p at line 173, column 8
// add at line 175, column 4
// noise at line 175, column 10
// p at line 175, column 16
// add at line 176, column 4
// msc at line 176, column 11
// sum at line 177, column 4
// abs at line 177, column 17
// add at line 177, column 21
// msc at line 178, column 4
// add at line 178, column 11
// msc at line 179, column 4
// clamp at line 179, column 10
// msc at line 179, column 16
// p at line 181, column 4
// p at line 181, column 8
// add at line 183, column 4
// noise at line 183, column 10
// p at line 183, column 16
// add at line 184, column 4
// msc at line 184, column 11
// sum at line 185, column 4
// abs at line 185, column 18
// add at line 185, column 22
// sum at line 190, column 11
// popping activation record 0:fnoise
// local variables: 
// variable p, unique name 0:fnoise:p, index 160, declared at line 143, column 19
// references:
/* DEF: getHeight */
// pushing activation record 0:getHeight
float getHeight(vec3 /* DEF: p */p){

    // pushing activation record 0:getHeight15:
    return 0.3 - 0.5 * /* REF: fnoise*/fnoise(/* REF: vec3*/vec3(0.5 * (/* REF: p*/p.x + 0.0 * /* REF: iGlobalTime*/iGlobalTime), 0.5 * /* REF: p*/p.z, 0.4 * /* REF: iGlobalTime*/iGlobalTime));
    }
// popping activation record 0:getHeight15:
// local variables: 
// references:
// fnoise at line 196, column 17
// vec3 at line 196, column 25
// p at line 196, column 35
// iGlobalTime at line 196, column 45
// p at line 196, column 63
// iGlobalTime at line 196, column 73
// popping activation record 0:getHeight
// local variables: 
// variable p, unique name 0:getHeight:p, index 168, declared at line 193, column 21
// references:

#define box_y 1.0


#define box_x 2.0


#define box_z 2.0


#define bg vec4(0.0, 0.0, 0.0, 1.0)


#define step 0.3


#define red vec4(1.0, 0.0, 0.0, 1.0)


#define PI_HALF 1.5707963267949

/* DEF: getSky */
// pushing activation record 0:getSky
vec4 getSky(vec3 /* DEF: rd */rd){

    // pushing activation record 0:getSky17:
    if (/* REF: rd*/rd.y > 0.3) return /* REF: vec4*/vec4(0.5, 0.8, 1.5, 1.0);
    if (/* REF: rd*/rd.y < 0.0) return /* REF: vec4*/vec4(0.0, 0.2, 0.4, 1.0);
    if (/* REF: rd*/rd.z > 0.9 && /* REF: rd*/rd.x > 0.3) {
    
        // pushing activation record 0:getSky17:18:
        if (/* REF: rd*/rd.y > 0.2) return 1.5 * /* REF: vec4*/vec4(2.0, 1.0, 1.0, 1.0);
        return 1.5 * /* REF: vec4*/vec4(2.0, 1.0, 0.5, 1.0);
        }
    // popping activation record 0:getSky17:18:
    // local variables: 
    // references:
    // rd at line 213, column 9
    // vec4 at line 213, column 32
    // vec4 at line 214, column 16
    }
// popping activation record 0:getSky17:
// local variables: 
// references:
// rd at line 209, column 8
// vec4 at line 209, column 27
// rd at line 210, column 8
// vec4 at line 210, column 27
// rd at line 212, column 8
// rd at line 212, column 22
// popping activation record 0:getSky
// local variables: 
// variable rd, unique name 0:getSky:rd, index 170, declared at line 207, column 17
// references:
/* DEF: shadeBox */
// pushing activation record 0:shadeBox
vec4 shadeBox(vec3 /* DEF: normal */normal, vec3 /* DEF: pos */pos, vec3 /* DEF: rd */rd){

    // pushing activation record 0:shadeBox20:
    float /* DEF: deep */deep = 1.0 + 0.5 * /* REF: pos*/pos.y;
    vec4 /* DEF: col */col = /* REF: deep*/deep * 0.4 * /* REF: vec4*/vec4(0.0, 0.3, 0.4, 1.0);
    return /* REF: col*/col;
    }
// popping activation record 0:shadeBox20:
// local variables: 
// variable deep, unique name 0:shadeBox20::deep, index 175, declared at line 221, column 10
// variable col, unique name 0:shadeBox20::col, index 176, declared at line 223, column 9
// references:
// pos at line 221, column 25
// deep at line 223, column 15
// vec4 at line 223, column 24
// col at line 225, column 11
// popping activation record 0:shadeBox
// local variables: 
// variable normal, unique name 0:shadeBox:normal, index 172, declared at line 219, column 19
// variable pos, unique name 0:shadeBox:pos, index 173, declared at line 219, column 32
// variable rd, unique name 0:shadeBox:rd, index 174, declared at line 219, column 42
// references:
/* DEF: shade */
// pushing activation record 0:shade
vec4 shade(vec3 /* DEF: normal */normal, vec3 /* DEF: pos */pos, vec3 /* DEF: rd */rd){

    // pushing activation record 0:shade22:
    float /* DEF: ReflectionFresnel */ReflectionFresnel = 0.99;
    float /* DEF: fresnel */fresnel = /* REF: ReflectionFresnel*/ReflectionFresnel * /* REF: pow*/pow(1.0 - /* REF: clamp*/clamp(/* REF: dot*/dot(-/* REF: rd*/rd, /* REF: normal*/normal), 0.0, 1.0), 5.0) + (1.0 - /* REF: ReflectionFresnel*/ReflectionFresnel);
    vec3 /* DEF: refVec */refVec = /* REF: reflect*/reflect(/* REF: rd*/rd, /* REF: normal*/normal);
    vec4 /* DEF: reflection */reflection = /* REF: getSky*/getSky(/* REF: refVec*/refVec);
    float /* DEF: deep */deep = 1.0 + 0.5 * /* REF: pos*/pos.y;
    vec4 /* DEF: col */col = /* REF: fresnel*/fresnel * /* REF: reflection*/reflection;
    /* REF: col*/col += /* REF: deep*/deep * 0.4 * /* REF: vec4*/vec4(0.0, 0.3, 0.4, 1.0);
    return /* REF: clamp*/clamp(/* REF: col*/col, 0.0, 1.0);
    }
// popping activation record 0:shade22:
// local variables: 
// variable ReflectionFresnel, unique name 0:shade22::ReflectionFresnel, index 181, declared at line 231, column 10
// variable fresnel, unique name 0:shade22::fresnel, index 182, declared at line 232, column 10
// variable refVec, unique name 0:shade22::refVec, index 183, declared at line 233, column 9
// variable reflection, unique name 0:shade22::reflection, index 184, declared at line 234, column 9
// variable deep, unique name 0:shade22::deep, index 185, declared at line 239, column 10
// variable col, unique name 0:shade22::col, index 186, declared at line 241, column 9
// references:
// ReflectionFresnel at line 232, column 20
// pow at line 232, column 38
// clamp at line 232, column 47
// dot at line 232, column 53
// rd at line 232, column 58
// normal at line 232, column 62
// ReflectionFresnel at line 232, column 94
// reflect at line 233, column 18
// rd at line 233, column 26
// normal at line 233, column 30
// getSky at line 234, column 22
// refVec at line 234, column 29
// pos at line 239, column 25
// fresnel at line 241, column 15
// reflection at line 241, column 23
// col at line 242, column 4
// deep at line 242, column 11
// vec4 at line 242, column 20
// clamp at line 244, column 11
// col at line 244, column 17
// popping activation record 0:shade
// local variables: 
// variable normal, unique name 0:shade:normal, index 178, declared at line 229, column 16
// variable pos, unique name 0:shade:pos, index 179, declared at line 229, column 29
// variable rd, unique name 0:shade:rd, index 180, declared at line 229, column 39
// references:
/* DEF: intersect_box */
// pushing activation record 0:intersect_box
vec4 intersect_box(vec3 /* DEF: ro */ro, vec3 /* DEF: rd */rd){

    // pushing activation record 0:intersect_box24:
    float /* DEF: t_min */t_min = 1000.0;
    vec3 /* DEF: t_normal */t_normal;
    float /* DEF: t */t = (-/* UNDEF: box_x*/box_x - /* REF: ro*/ro.x) / /* REF: rd*/rd.x;
    vec3 /* DEF: p */p = /* REF: ro*/ro + /* REF: t*/t * /* REF: rd*/rd;
    if (/* REF: p*/p.y > -/* UNDEF: box_y*/box_y && /* REF: p*/p.z < /* UNDEF: box_z*/box_z && /* REF: p*/p.z > -/* UNDEF: box_z*/box_z) {
    
        // pushing activation record 0:intersect_box24:25:
        /* REF: t_normal*/t_normal = /* REF: vec3*/vec3(-1.0, 0.0, 0.0);
        /* REF: t_min*/t_min = /* REF: t*/t;
        }
    // popping activation record 0:intersect_box24:25:
    // local variables: 
    // references:
    // t_normal at line 258, column 8
    // vec3 at line 258, column 19
    // t_min at line 259, column 8
    // t at line 259, column 16
    /* REF: t*/t = (/* UNDEF: box_x*/box_x - /* REF: ro*/ro.x) / /* REF: rd*/rd.x;
    /* REF: p*/p = /* REF: ro*/ro + /* REF: t*/t * /* REF: rd*/rd;
    if (/* REF: p*/p.y > -/* UNDEF: box_y*/box_y && /* REF: p*/p.z < /* UNDEF: box_z*/box_z && /* REF: p*/p.z > -/* UNDEF: box_z*/box_z) {
    
        // pushing activation record 0:intersect_box24:25:
        if (/* REF: t*/t < /* REF: t_min*/t_min) {
        
            // pushing activation record 0:intersect_box24:25:27:
            /* REF: t_normal*/t_normal = /* REF: vec3*/vec3(1.0, 0.0, 0.0);
            /* REF: t_min*/t_min = /* REF: t*/t;
            }
        // popping activation record 0:intersect_box24:25:27:
        // local variables: 
        // references:
        // t_normal at line 274, column 9
        // vec3 at line 274, column 20
        // t_min at line 275, column 3
        // t at line 275, column 11
        }
    // popping activation record 0:intersect_box24:25:
    // local variables: 
    // references:
    // t at line 273, column 12
    // t_min at line 273, column 16
    /* REF: t*/t = (-/* UNDEF: box_z*/box_z - /* REF: ro*/ro.z) / /* REF: rd*/rd.z;
    /* REF: p*/p = /* REF: ro*/ro + /* REF: t*/t * /* REF: rd*/rd;
    if (/* REF: p*/p.y > -/* UNDEF: box_y*/box_y && /* REF: p*/p.x < /* UNDEF: box_x*/box_x && /* REF: p*/p.x > -/* UNDEF: box_x*/box_x) {
    
        // pushing activation record 0:intersect_box24:25:
        if (/* REF: t*/t < /* REF: t_min*/t_min) {
        
            // pushing activation record 0:intersect_box24:25:29:
            /* REF: t_normal*/t_normal = /* REF: vec3*/vec3(0.0, 0.0, -1.0);
            /* REF: t_min*/t_min = /* REF: t*/t;
            }
        // popping activation record 0:intersect_box24:25:29:
        // local variables: 
        // references:
        // t_normal at line 286, column 9
        // vec3 at line 286, column 20
        // t_min at line 287, column 12
        // t at line 287, column 20
        }
    // popping activation record 0:intersect_box24:25:
    // local variables: 
    // references:
    // t at line 285, column 12
    // t_min at line 285, column 16
    /* REF: t*/t = (/* UNDEF: box_z*/box_z - /* REF: ro*/ro.z) / /* REF: rd*/rd.z;
    /* REF: p*/p = /* REF: ro*/ro + /* REF: t*/t * /* REF: rd*/rd;
    if (/* REF: p*/p.y > -/* UNDEF: box_y*/box_y && /* REF: p*/p.x < /* UNDEF: box_x*/box_x && /* REF: p*/p.x > -/* UNDEF: box_x*/box_x) {
    
        // pushing activation record 0:intersect_box24:25:
        if (/* REF: t*/t < /* REF: t_min*/t_min) {
        
            // pushing activation record 0:intersect_box24:25:31:
            /* REF: t_normal*/t_normal = /* REF: vec3*/vec3(0.0, 0.0, 1.0);
            /* REF: t_min*/t_min = /* REF: t*/t;
            }
        // popping activation record 0:intersect_box24:25:31:
        // local variables: 
        // references:
        // t_normal at line 298, column 9
        // vec3 at line 298, column 20
        // t_min at line 299, column 12
        // t at line 299, column 20
        }
    // popping activation record 0:intersect_box24:25:
    // local variables: 
    // references:
    // t at line 297, column 12
    // t_min at line 297, column 16
    if (/* REF: t_min*/t_min < 1000.0) return /* REF: shadeBox*/shadeBox(/* REF: t_normal*/t_normal, /* REF: ro*/ro + /* REF: t_min*/t_min * /* REF: rd*/rd, /* REF: rd*/rd);
    return /* UNDEF: bg*/bg;
    }
// popping activation record 0:intersect_box24:
// local variables: 
// variable t_min, unique name 0:intersect_box24::t_min, index 190, declared at line 250, column 10
// variable t_normal, unique name 0:intersect_box24::t_normal, index 191, declared at line 251, column 9
// variable t, unique name 0:intersect_box24::t, index 192, declared at line 254, column 10
// variable p, unique name 0:intersect_box24::p, index 193, declared at line 255, column 9
// references:
// ro at line 254, column 23
// rd at line 254, column 31
// ro at line 255, column 13
// t at line 255, column 18
// rd at line 255, column 20
// p at line 257, column 8
// p at line 257, column 24
// p at line 257, column 39
// t at line 269, column 4
// ro at line 269, column 16
// rd at line 269, column 24
// p at line 270, column 4
// ro at line 270, column 8
// t at line 270, column 13
// rd at line 270, column 15
// p at line 272, column 8
// p at line 272, column 24
// p at line 272, column 39
// t at line 280, column 1
// ro at line 280, column 14
// rd at line 280, column 22
// p at line 281, column 4
// ro at line 281, column 8
// t at line 281, column 13
// rd at line 281, column 15
// p at line 283, column 8
// p at line 283, column 24
// p at line 283, column 39
// t at line 292, column 1
// ro at line 292, column 13
// rd at line 292, column 21
// p at line 293, column 4
// ro at line 293, column 8
// t at line 293, column 13
// rd at line 293, column 15
// p at line 295, column 8
// p at line 295, column 24
// p at line 295, column 39
// t_min at line 304, column 8
// shadeBox at line 304, column 31
// t_normal at line 304, column 40
// ro at line 304, column 50
// t_min at line 304, column 55
// rd at line 304, column 61
// rd at line 304, column 65
// popping activation record 0:intersect_box
// local variables: 
// variable ro, unique name 0:intersect_box:ro, index 188, declared at line 247, column 24
// variable rd, unique name 0:intersect_box:rd, index 189, declared at line 247, column 33
// references:
/* DEF: trace_heightfield */
// pushing activation record 0:trace_heightfield
vec4 trace_heightfield(vec3 /* DEF: ro */ro, vec3 /* DEF: rd */rd){

    // pushing activation record 0:trace_heightfield33:
    float /* DEF: t */t = (1.0 - /* REF: ro*/ro.y) / /* REF: rd*/rd.y;
    if (/* REF: t*/t < 0.0) return /* UNDEF: red*/red;
    vec3 /* DEF: p */p = /* REF: ro*/ro + /* REF: t*/t * /* REF: rd*/rd;
    if (/* REF: p*/p.x < -2.0 && /* REF: rd*/rd.x <= 0.0) return /* UNDEF: bg*/bg;
    if (/* REF: p*/p.x > 2.0 && /* REF: rd*/rd.x >= 0.0) return /* UNDEF: bg*/bg;
    if (/* REF: p*/p.z < -2.0 && /* REF: rd*/rd.z <= 0.0) return /* UNDEF: bg*/bg;
    if (/* REF: p*/p.z > 2.0 && /* REF: rd*/rd.z >= 0.0) return /* UNDEF: bg*/bg;
    float /* DEF: h */h, /* DEF: last_h */last_h;
    bool /* DEF: not_found */not_found = true;
    vec3 /* DEF: last_p */last_p = /* REF: p*/p;
    
    // pushing activation record 0:trace_heightfield33:34:for
    for (int /* DEF: i */i = 0; /* REF: i*/i < 20; /* REF: i*/i++) {
    
        // pushing activation record 0:trace_heightfield33:34:for35:
        /* REF: p*/p += /* REF: step*/step * /* REF: rd*/rd;
        /* REF: h*/h = /* REF: getHeight*/getHeight(/* REF: p*/p);
        if (/* REF: p*/p.y < /* REF: h*/h) {
        
            // pushing activation record 0:trace_heightfield33:34:for35:36:
            /* REF: not_found*/not_found = false;
            break;
            }
        // popping activation record 0:trace_heightfield33:34:for35:36:
        // local variables: 
        // references:
        // not_found at line 342, column 22
        /* REF: last_h*/last_h = /* REF: h*/h;
        /* REF: last_p*/last_p = /* REF: p*/p;
        }
    // popping activation record 0:trace_heightfield33:34:for35:
    // local variables: 
    // references:
    // p at line 338, column 8
    // step at line 338, column 13
    // rd at line 338, column 18
    // h at line 340, column 5
    // getHeight at line 340, column 9
    // p at line 340, column 19
    // p at line 342, column 12
    // h at line 342, column 18
    // last_h at line 343, column 8
    // h at line 343, column 17
    // last_p at line 344, column 8
    // p at line 344, column 17
    // popping activation record 0:trace_heightfield33:34:for
    // local variables: 
    // variable i, unique name 0:trace_heightfield33:34:for:i, index 203, declared at line 336, column 13
    // references:
    // i at line 336, column 18
    // i at line 336, column 24
    if (/* REF: not_found*/not_found) return /* UNDEF: bg*/bg;
    float /* DEF: dh2 */dh2 = /* REF: h*/h - /* REF: p*/p.y;
    float /* DEF: dh1 */dh1 = /* REF: last_p*/last_p.y - /* REF: last_h*/last_h;
    /* REF: p*/p = /* REF: last_p*/last_p + /* REF: rd*/rd * /* REF: step*/step / (/* REF: dh2*/dh2 / /* REF: dh1*/dh1 + 1.0);
    if (/* REF: p*/p.x < -2.0) {
    
        // pushing activation record 0:trace_heightfield33:34:
        if (/* REF: rd*/rd.x <= 0.0) return /* UNDEF: bg*/bg;
        return /* REF: intersect_box*/intersect_box(/* REF: ro*/ro, /* REF: rd*/rd);
        }
    // popping activation record 0:trace_heightfield33:34:
    // local variables: 
    // references:
    // rd at line 356, column 12
    // intersect_box at line 357, column 15
    // ro at line 357, column 29
    // rd at line 357, column 33
    if (/* REF: p*/p.x > 2.0) {
    
        // pushing activation record 0:trace_heightfield33:34:
        if (/* REF: rd*/rd.x >= 0.0) return /* UNDEF: bg*/bg;
        return /* REF: intersect_box*/intersect_box(/* REF: ro*/ro, /* REF: rd*/rd);
        }
    // popping activation record 0:trace_heightfield33:34:
    // local variables: 
    // references:
    // rd at line 360, column 12
    // intersect_box at line 361, column 15
    // ro at line 361, column 29
    // rd at line 361, column 33
    if (/* REF: p*/p.z < -2.0) {
    
        // pushing activation record 0:trace_heightfield33:34:
        if (/* REF: rd*/rd.z <= 0.0) return /* UNDEF: bg*/bg;
        return /* REF: intersect_box*/intersect_box(/* REF: ro*/ro, /* REF: rd*/rd);
        }
    // popping activation record 0:trace_heightfield33:34:
    // local variables: 
    // references:
    // rd at line 364, column 12
    // intersect_box at line 365, column 15
    // ro at line 365, column 29
    // rd at line 365, column 33
    if (/* REF: p*/p.z > 2.0) {
    
        // pushing activation record 0:trace_heightfield33:34:
        if (/* REF: rd*/rd.z >= 0.0) return /* UNDEF: bg*/bg;
        return /* REF: intersect_box*/intersect_box(/* REF: ro*/ro, /* REF: rd*/rd);
        }
    // popping activation record 0:trace_heightfield33:34:
    // local variables: 
    // references:
    // rd at line 368, column 12
    // intersect_box at line 369, column 15
    // ro at line 369, column 29
    // rd at line 369, column 33
    vec3 /* DEF: pdx */pdx = /* REF: p*/p + /* REF: vec3*/vec3(0.01, 0.0, 0.00);
    vec3 /* DEF: pdz */pdz = /* REF: p*/p + /* REF: vec3*/vec3(0.00, 0.0, 0.01);
    float /* DEF: hdx */hdx = /* REF: getHeight*/getHeight(/* REF: pdx*/pdx);
    float /* DEF: hdz */hdz = /* REF: getHeight*/getHeight(/* REF: pdz*/pdz);
    /* REF: h*/h = /* REF: getHeight*/getHeight(/* REF: p*/p);
    /* REF: p*/p.y = /* REF: h*/h;
    /* REF: pdx*/pdx.y = /* REF: hdx*/hdx;
    /* REF: pdz*/pdz.y = /* REF: hdz*/hdz;
    vec3 /* DEF: normal */normal = /* REF: normalize*/normalize(/* REF: cross*/cross(/* REF: p*/p - /* REF: pdz*/pdz, /* REF: p*/p - /* REF: pdx*/pdx));
    return /* REF: shade*/shade(/* REF: normal*/normal, /* REF: p*/p, /* REF: rd*/rd);
    }
// popping activation record 0:trace_heightfield33:
// local variables: 
// variable t, unique name 0:trace_heightfield33::t, index 197, declared at line 319, column 10
// variable p, unique name 0:trace_heightfield33::p, index 198, declared at line 323, column 9
// variable h, unique name 0:trace_heightfield33::h, index 199, declared at line 332, column 10
// variable last_h, unique name 0:trace_heightfield33::last_h, index 200, declared at line 332, column 13
// variable not_found, unique name 0:trace_heightfield33::not_found, index 201, declared at line 333, column 9
// variable last_p, unique name 0:trace_heightfield33::last_p, index 202, declared at line 334, column 9
// variable dh2, unique name 0:trace_heightfield33::dh2, index 204, declared at line 350, column 10
// variable dh1, unique name 0:trace_heightfield33::dh1, index 205, declared at line 351, column 10
// variable pdx, unique name 0:trace_heightfield33::pdx, index 206, declared at line 372, column 9
// variable pdz, unique name 0:trace_heightfield33::pdz, index 207, declared at line 373, column 9
// variable hdx, unique name 0:trace_heightfield33::hdx, index 208, declared at line 375, column 10
// variable hdz, unique name 0:trace_heightfield33::hdz, index 209, declared at line 376, column 10
// variable normal, unique name 0:trace_heightfield33::normal, index 210, declared at line 383, column 9
// references:
// ro at line 319, column 21
// rd at line 319, column 29
// t at line 321, column 8
// ro at line 323, column 13
// t at line 323, column 18
// rd at line 323, column 20
// p at line 325, column 8
// rd at line 325, column 22
// p at line 326, column 8
// rd at line 326, column 22
// p at line 327, column 8
// rd at line 327, column 22
// p at line 328, column 8
// rd at line 328, column 22
// p at line 334, column 18
// not_found at line 347, column 8
// h at line 350, column 16
// p at line 350, column 20
// last_p at line 351, column 16
// last_h at line 351, column 27
// p at line 352, column 2
// last_p at line 352, column 6
// rd at line 352, column 15
// step at line 352, column 18
// dh2 at line 352, column 24
// dh1 at line 352, column 28
// p at line 355, column 8
// p at line 359, column 8
// p at line 363, column 8
// p at line 367, column 8
// p at line 372, column 15
// vec3 at line 372, column 19
// p at line 373, column 15
// vec3 at line 373, column 19
// getHeight at line 375, column 16
// pdx at line 375, column 27
// getHeight at line 376, column 16
// pdz at line 376, column 27
// h at line 377, column 4
// getHeight at line 377, column 8
// p at line 377, column 19
// p at line 379, column 4
// h at line 379, column 10
// pdx at line 380, column 4
// hdx at line 380, column 12
// pdz at line 381, column 4
// hdz at line 381, column 12
// normalize at line 383, column 18
// cross at line 383, column 28
// p at line 383, column 35
// pdz at line 383, column 37
// p at line 383, column 42
// pdx at line 383, column 44
// shade at line 385, column 9
// normal at line 385, column 15
// p at line 385, column 23
// rd at line 385, column 26
// popping activation record 0:trace_heightfield
// local variables: 
// variable ro, unique name 0:trace_heightfield:ro, index 195, declared at line 312, column 29
// variable rd, unique name 0:trace_heightfield:rd, index 196, declared at line 312, column 38
// references:
/* DEF: setCamera */
// pushing activation record 0:setCamera
mat3 setCamera(in vec3 /* DEF: ro */ro, in vec3 /* DEF: ta */ta, float /* DEF: cr */cr){

    // pushing activation record 0:setCamera42:
    vec3 /* DEF: cw */cw = /* REF: normalize*/normalize(/* REF: ta*/ta - /* REF: ro*/ro);
    vec3 /* DEF: cp */cp = /* REF: vec3*/vec3(/* REF: sin*/sin(/* REF: cr*/cr), /* REF: cos*/cos(/* REF: cr*/cr), 0.0);
    vec3 /* DEF: cu */cu = /* REF: normalize*/normalize(/* REF: cross*/cross(/* REF: cw*/cw, /* REF: cp*/cp));
    vec3 /* DEF: cv */cv = /* REF: normalize*/normalize(/* REF: cross*/cross(/* REF: cu*/cu, /* REF: cw*/cw));
    return /* REF: mat3*/mat3(/* REF: cu*/cu, /* REF: cv*/cv, /* REF: cw*/cw);
    }
// popping activation record 0:setCamera42:
// local variables: 
// variable cw, unique name 0:setCamera42::cw, index 215, declared at line 393, column 6
// variable cp, unique name 0:setCamera42::cp, index 216, declared at line 394, column 6
// variable cu, unique name 0:setCamera42::cu, index 217, declared at line 395, column 6
// variable cv, unique name 0:setCamera42::cv, index 218, declared at line 396, column 6
// references:
// normalize at line 393, column 11
// ta at line 393, column 21
// ro at line 393, column 24
// vec3 at line 394, column 11
// sin at line 394, column 16
// cr at line 394, column 20
// cos at line 394, column 25
// cr at line 394, column 29
// normalize at line 395, column 11
// cross at line 395, column 22
// cw at line 395, column 28
// cp at line 395, column 31
// normalize at line 396, column 11
// cross at line 396, column 22
// cu at line 396, column 28
// cw at line 396, column 31
// mat3 at line 397, column 11
// cu at line 397, column 17
// cv at line 397, column 21
// cw at line 397, column 25
// popping activation record 0:setCamera
// local variables: 
// variable ro, unique name 0:setCamera:ro, index 212, declared at line 391, column 24
// variable ta, unique name 0:setCamera:ta, index 213, declared at line 391, column 36
// variable cr, unique name 0:setCamera:cr, index 214, declared at line 391, column 46
// references:
/* DEF: mainImage */
// pushing activation record 0:mainImage
void mainImage(out vec4 /* DEF: fragColor */fragColor, in vec2 /* DEF: fragCoord */fragCoord){

    // pushing activation record 0:mainImage44:
    vec2 /* DEF: p */p = (-/* REF: iResolution*/iResolution.xy + 2.0 * /* REF: fragCoord*/fragCoord.xy) / /* REF: iResolution*/iResolution.y;
    vec2 /* DEF: m */m = /* REF: iMouse*/iMouse.xy / /* REF: iResolution*/iResolution.xy;
    /* REF: m*/m.y += 0.3;
    /* REF: m*/m.x += 0.72;
    vec3 /* DEF: ro */ro = 9.0 * /* REF: normalize*/normalize(/* REF: vec3*/vec3(/* REF: sin*/sin(5.0 * /* REF: m*/m.x), 1.0 * /* REF: m*/m.y, /* REF: cos*/cos(5.0 * /* REF: m*/m.x)));
    vec3 /* DEF: ta */ta = /* REF: vec3*/vec3(0.0, -1.0, 0.0);
    mat3 /* DEF: ca */ca = /* REF: setCamera*/setCamera(/* REF: ro*/ro, /* REF: ta*/ta, 0.0);
    vec3 /* DEF: rd */rd = /* REF: ca*/ca * /* REF: normalize*/normalize(/* REF: vec3*/vec3(/* REF: p*/p.xy, 4.0));
    /* REF: fragColor*/fragColor = /* REF: trace_heightfield*/trace_heightfield(/* REF: ro*/ro, /* REF: rd*/rd);
    }
// popping activation record 0:mainImage44:
// local variables: 
// variable p, unique name 0:mainImage44::p, index 222, declared at line 403, column 9
// variable m, unique name 0:mainImage44::m, index 223, declared at line 404, column 9
// variable ro, unique name 0:mainImage44::ro, index 224, declared at line 413, column 9
// variable ta, unique name 0:mainImage44::ta, index 225, declared at line 414, column 6
// variable ca, unique name 0:mainImage44::ca, index 226, declared at line 415, column 9
// variable rd, unique name 0:mainImage44::rd, index 227, declared at line 417, column 9
// references:
// iResolution at line 403, column 15
// fragCoord at line 403, column 36
// iResolution at line 403, column 51
// iMouse at line 404, column 13
// iResolution at line 404, column 23
// m at line 406, column 4
// m at line 407, column 4
// normalize at line 413, column 18
// vec3 at line 413, column 28
// sin at line 413, column 33
// m at line 413, column 41
// m at line 413, column 51
// cos at line 413, column 56
// m at line 413, column 64
// vec3 at line 414, column 11
// setCamera at line 415, column 14
// ro at line 415, column 25
// ta at line 415, column 29
// ca at line 417, column 14
// normalize at line 417, column 19
// vec3 at line 417, column 30
// p at line 417, column 35
// fragColor at line 420, column 4
// trace_heightfield at line 420, column 16
// ro at line 420, column 35
// rd at line 420, column 39
// popping activation record 0:mainImage
// local variables: 
// variable fragColor, unique name 0:mainImage:fragColor, index 220, declared at line 401, column 25
// variable fragCoord, unique name 0:mainImage:fragCoord, index 221, declared at line 401, column 44
// references:
/* DEF: mainVR */
// pushing activation record 0:mainVR
void mainVR(out vec4 /* DEF: fragColor */fragColor, in vec2 /* DEF: fragCoord */fragCoord, in vec3 /* DEF: fragRayOri */fragRayOri, in vec3 /* DEF: fragRayDir */fragRayDir){

    // pushing activation record 0:mainVR46:
    /* REF: fragColor*/fragColor = /* REF: trace_heightfield*/trace_heightfield(/* REF: fragRayOri*/fragRayOri, /* REF: fragRayDir*/fragRayDir);
    }
// popping activation record 0:mainVR46:
// local variables: 
// references:
// fragColor at line 426, column 4
// trace_heightfield at line 426, column 16
// fragRayOri at line 426, column 35
// fragRayDir at line 426, column 47
// popping activation record 0:mainVR
// local variables: 
// variable fragColor, unique name 0:mainVR:fragColor, index 229, declared at line 424, column 22
// variable fragCoord, unique name 0:mainVR:fragCoord, index 230, declared at line 424, column 41
// variable fragRayOri, unique name 0:mainVR:fragRayOri, index 231, declared at line 424, column 60
// variable fragRayDir, unique name 0:mainVR:fragRayDir, index 232, declared at line 424, column 80
// references:
// undefined variables 
//    box_x
//    box_y
//    box_z
//    bg
//    red
