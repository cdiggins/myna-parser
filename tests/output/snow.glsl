
// pushing activation record 
/* DEF: iResolution *//* DEF: iSampleRate *//* DEF: iGlobalTime *//* DEF: iTime *//* DEF: iTimeDelta *//* DEF: iFrame *//* DEF: iChannelTime *//* DEF: iMouse *//* DEF: iDate *//* DEF: iChannelResolution *//* DEF: vec2 *//* DEF: vec3 *//* DEF: vec4 *//* DEF: mat2 *//* DEF: mat3 *//* DEF: mat4 *//* DEF: ivec2 *//* DEF: ivec3 *//* DEF: ivec4 *//* DEF: bvec2 *//* DEF: bvec3 *//* DEF: bvec4 *//* DEF: + *//* DEF: - *//* DEF: * *//* DEF: / *//* DEF: < *//* DEF: > *//* DEF: <= *//* DEF: >= *//* DEF: == *//* DEF: ++ *//* DEF: -- *//* DEF: && *//* DEF: || *//* DEF: ^^ *//* DEF: ! *//* DEF: ? *//* DEF: matrixCompMult *//* DEF: all *//* DEF: any *//* DEF: equal *//* DEF: greaterThan *//* DEF: greaterThanEqual *//* DEF: lessThan *//* DEF: lessThanEqual *//* DEF: not *//* DEF: notEqual *//* DEF: ftransform *//* DEF: cross *//* DEF: distance *//* DEF: dot *//* DEF: faceforward *//* DEF: length *//* DEF: normalize *//* DEF: reflect *//* DEF: refract *//* DEF: sin *//* DEF: cos *//* DEF: tan *//* DEF: asin *//* DEF: acos *//* DEF: atan *//* DEF: radians *//* DEF: degrees *//* DEF: abs *//* DEF: ceil *//* DEF: clamp *//* DEF: floor *//* DEF: fract *//* DEF: max *//* DEF: min *//* DEF: mix *//* DEF: mod *//* DEF: sign *//* DEF: smoothstep *//* DEF: step *//* DEF: pow *//* DEF: exp *//* DEF: log *//* DEF: exp2 *//* DEF: log2 *//* DEF: sqrt *//* DEF: inversesqrt *//* DEF: dFdx *//* DEF: dFdy *//* DEF: fwidth *//* DEF: texture1D *//* DEF: texture1DProj *//* DEF: texture2D *//* DEF: texture2DProj *//* DEF: texture3D *//* DEF: texture3DProj *//* DEF: textureCube *//* DEF: shadow1D *//* DEF: shadow2D *//* DEF: shadow1DProj *//* DEF: shadow2DProj *//* DEF: texture1DLod *//* DEF: texture1DProjLod *//* DEF: texture2DLod *//* DEF: texture2DProjLod *//* DEF: texture3DProjLod *//* DEF: textureCubeLod *//* DEF: shadow1DLod *//* DEF: shadow2DLod *//* DEF: shadow1DProjLod *//* DEF: shadow2DProjLod *//* DEF: noise1 *//* DEF: noise2 *//* DEF: noise3 *//* DEF: noise4 */uniform float /* DEF: time */time;
uniform vec2 /* DEF: mouse */mouse;
uniform vec2 /* DEF: resolution */resolution;
/* DEF: snow */
// pushing activation record 0:snow
float snow(vec2 /* DEF: uv */uv, float /* DEF: scale */scale){

    // pushing activation record 0:snow1:
    float /* DEF: w */w = /* REF: smoothstep*/smoothstep(1., 0., -/* REF: uv*/uv.y * (/* REF: scale*/scale / 10.));
    if (/* REF: w*/w < .1) return 0.;
    /* REF: uv*/uv += /* REF: time*/time / /* REF: scale*/scale;
    /* REF: uv*/uv.y += /* REF: time*/time * 2. / /* REF: scale*/scale;
    /* REF: uv*/uv.x += /* REF: sin*/sin(/* REF: uv*/uv.y + /* REF: time*/time * .5) / /* REF: scale*/scale;
    /* REF: uv*/uv *= /* REF: scale*/scale;
    vec2 /* DEF: s */s = /* REF: floor*/floor(/* REF: uv*/uv), /* DEF: f */f = /* REF: fract*/fract(/* REF: uv*/uv), /* DEF: p */p;
    float /* DEF: k */k = 3., /* DEF: d */d;
    /* REF: p*/p = .5 + .35 * /* REF: sin*/sin(11. * /* REF: fract*/fract(/* REF: sin*/sin((/* REF: s*/s + /* REF: p*/p + /* REF: scale*/scale) * /* REF: mat2*/mat2(7, 3, 6, 5)) * 2.)) - /* REF: f*/f;
    /* REF: d*/d = /* REF: length*/length(/* REF: p*/p);
    /* REF: k*/k = /* REF: min*/min(/* REF: d*/d, /* REF: k*/k);
    /* REF: k*/k = /* REF: smoothstep*/smoothstep(0., /* REF: k*/k, /* REF: sin*/sin(/* REF: f*/f.x + /* REF: f*/f.y) * 0.02);
    return /* REF: k*/k * /* REF: w*/w;
    }
// popping activation record 0:snow1:
// local variables: 
// variable w, unique name 0:snow1::w, index 118, declared at line 11, column 7
// variable s, unique name 0:snow1::s, index 119, declared at line 14, column 16
// variable f, unique name 0:snow1::f, index 120, declared at line 14, column 28
// variable p, unique name 0:snow1::p, index 121, declared at line 14, column 40
// variable k, unique name 0:snow1::k, index 122, declared at line 14, column 48
// variable d, unique name 0:snow1::d, index 123, declared at line 14, column 53
// references:
// smoothstep at line 11, column 9
// uv at line 11, column 27
// scale at line 11, column 33
// w at line 12, column 7
// uv at line 13, column 1
// time at line 13, column 5
// scale at line 13, column 10
// uv at line 13, column 16
// time at line 13, column 22
// scale at line 13, column 30
// uv at line 13, column 36
// sin at line 13, column 42
// uv at line 13, column 46
// time at line 13, column 51
// scale at line 13, column 60
// uv at line 14, column 1
// scale at line 14, column 5
// floor at line 14, column 18
// uv at line 14, column 24
// fract at line 14, column 30
// uv at line 14, column 36
// p at line 15, column 1
// sin at line 15, column 10
// fract at line 15, column 18
// sin at line 15, column 24
// s at line 15, column 29
// p at line 15, column 31
// scale at line 15, column 33
// mat2 at line 15, column 40
// f at line 15, column 60
// d at line 15, column 62
// length at line 15, column 64
// p at line 15, column 71
// k at line 15, column 74
// min at line 15, column 76
// d at line 15, column 80
// k at line 15, column 82
// k at line 16, column 1
// smoothstep at line 16, column 3
// k at line 16, column 17
// sin at line 16, column 19
// f at line 16, column 23
// f at line 16, column 27
// k at line 17, column 8
// w at line 17, column 10
// popping activation record 0:snow
// local variables: 
// variable uv, unique name 0:snow:uv, index 116, declared at line 9, column 16
// variable scale, unique name 0:snow:scale, index 117, declared at line 9, column 25
// references:
/* DEF: main */
// pushing activation record 0:main
void main(){

    // pushing activation record 0:main3:
    vec2 /* DEF: uv */uv = (/* UNDEF: gl_FragCoord*/gl_FragCoord.xy * 1. - /* REF: resolution*/resolution.xy) / /* REF: min*/min(/* REF: resolution*/resolution.x, -/* REF: resolution*/resolution.y);
    vec3 /* DEF: finalColor */finalColor = /* REF: vec3*/vec3(0);
    float /* DEF: c */c = /* REF: smoothstep*/smoothstep(1., 0.3, /* REF: clamp*/clamp(/* REF: uv*/uv.y * .3 + 0.7, 0., 2.75));
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 30.) * .0;
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 20.) * .0;
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 15.) * .0;
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 10.);
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 8.);
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 6.);
    /* REF: c*/c += /* REF: snow*/snow(/* REF: uv*/uv, 5.);
    /* REF: finalColor*/finalColor = (/* REF: vec3*/vec3(/* REF: c*/c));
    /* REF: finalColor*/finalColor *= /* REF: vec3*/vec3(.7, 0.1, 0.);
    /* UNDEF: gl_FragColor*/gl_FragColor = /* REF: vec4*/vec4(/* REF: finalColor*/finalColor, 1);
    }
// popping activation record 0:main3:
// local variables: 
// variable uv, unique name 0:main3::uv, index 125, declared at line 22, column 6
// variable finalColor, unique name 0:main3::finalColor, index 126, declared at line 23, column 6
// variable c, unique name 0:main3::c, index 127, declared at line 24, column 7
// references:
// resolution at line 22, column 29
// min at line 22, column 44
// resolution at line 22, column 48
// resolution at line 22, column 62
// vec3 at line 23, column 17
// smoothstep at line 24, column 9
// clamp at line 24, column 27
// uv at line 24, column 33
// c at line 25, column 1
// snow at line 25, column 4
// uv at line 25, column 9
// c at line 26, column 1
// snow at line 26, column 4
// uv at line 26, column 9
// c at line 27, column 1
// snow at line 27, column 4
// uv at line 27, column 9
// c at line 28, column 1
// snow at line 28, column 4
// uv at line 28, column 9
// c at line 29, column 1
// snow at line 29, column 4
// uv at line 29, column 9
// c at line 30, column 1
// snow at line 30, column 4
// uv at line 30, column 9
// c at line 31, column 1
// snow at line 31, column 4
// uv at line 31, column 9
// finalColor at line 32, column 1
// vec3 at line 32, column 13
// c at line 32, column 18
// finalColor at line 33, column 1
// vec3 at line 33, column 15
// vec4 at line 34, column 16
// finalColor at line 34, column 21
// popping activation record 0:main
// local variables: 
// references:
// undefined variables 
//    gl_FragCoord
//    gl_FragColor
