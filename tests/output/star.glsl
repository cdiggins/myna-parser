
// pushing activation record 
/* DEF: iResolution *//* DEF: iSampleRate *//* DEF: iGlobalTime *//* DEF: iTime *//* DEF: iTimeDelta *//* DEF: iFrame *//* DEF: iChannelTime *//* DEF: iMouse *//* DEF: iDate *//* DEF: iChannelResolution *//* DEF: vec2 *//* DEF: vec3 *//* DEF: vec4 *//* DEF: mat2 *//* DEF: mat3 *//* DEF: mat4 *//* DEF: ivec2 *//* DEF: ivec3 *//* DEF: ivec4 *//* DEF: bvec2 *//* DEF: bvec3 *//* DEF: bvec4 *//* DEF: + *//* DEF: - *//* DEF: * *//* DEF: / *//* DEF: < *//* DEF: > *//* DEF: <= *//* DEF: >= *//* DEF: == *//* DEF: ++ *//* DEF: -- *//* DEF: && *//* DEF: || *//* DEF: ^^ *//* DEF: ! *//* DEF: ? *//* DEF: matrixCompMult *//* DEF: all *//* DEF: any *//* DEF: equal *//* DEF: greaterThan *//* DEF: greaterThanEqual *//* DEF: lessThan *//* DEF: lessThanEqual *//* DEF: not *//* DEF: notEqual *//* DEF: ftransform *//* DEF: cross *//* DEF: distance *//* DEF: dot *//* DEF: faceforward *//* DEF: length *//* DEF: normalize *//* DEF: reflect *//* DEF: refract *//* DEF: sin *//* DEF: cos *//* DEF: tan *//* DEF: asin *//* DEF: acos *//* DEF: atan *//* DEF: radians *//* DEF: degrees *//* DEF: abs *//* DEF: ceil *//* DEF: clamp *//* DEF: floor *//* DEF: fract *//* DEF: max *//* DEF: min *//* DEF: mix *//* DEF: mod *//* DEF: sign *//* DEF: smoothstep *//* DEF: step *//* DEF: pow *//* DEF: exp *//* DEF: log *//* DEF: exp2 *//* DEF: log2 *//* DEF: sqrt *//* DEF: inversesqrt *//* DEF: dFdx *//* DEF: dFdy *//* DEF: fwidth *//* DEF: texture1D *//* DEF: texture1DProj *//* DEF: texture2D *//* DEF: texture2DProj *//* DEF: texture3D *//* DEF: texture3DProj *//* DEF: textureCube *//* DEF: shadow1D *//* DEF: shadow2D *//* DEF: shadow1DProj *//* DEF: shadow2DProj *//* DEF: texture1DLod *//* DEF: texture1DProjLod *//* DEF: texture2DLod *//* DEF: texture2DProjLod *//* DEF: texture3DProjLod *//* DEF: textureCubeLod *//* DEF: shadow1DLod *//* DEF: shadow2DLod *//* DEF: shadow1DProjLod *//* DEF: shadow2DProjLod *//* DEF: noise1 *//* DEF: noise2 *//* DEF: noise3 *//* DEF: noise4 *//* DEF: snoise */
// pushing activation record 0:snoise
float snoise(vec3 /* DEF: uv */uv, float /* DEF: res */res){

    // pushing activation record 0:snoise1:
    const vec3 /* DEF: s */s = /* REF: vec3*/vec3(1e0, 1e2, 1e4);
    /* REF: uv*/uv *= /* REF: res*/res;
    vec3 /* DEF: uv0 */uv0 = /* REF: floor*/floor(/* REF: mod*/mod(/* REF: uv*/uv, /* REF: res*/res)) * /* REF: s*/s;
    vec3 /* DEF: uv1 */uv1 = /* REF: floor*/floor(/* REF: mod*/mod(/* REF: uv*/uv + /* REF: vec3*/vec3(1.), /* REF: res*/res)) * /* REF: s*/s;
    vec3 /* DEF: f */f = /* REF: fract*/fract(/* REF: uv*/uv);
    /* REF: f*/f = /* REF: f*/f * /* REF: f*/f * (3.0 - 2.0 * /* REF: f*/f);
    vec4 /* DEF: v */v = /* REF: vec4*/vec4(/* REF: uv0*/uv0.x + /* REF: uv0*/uv0.y + /* REF: uv0*/uv0.z, /* REF: uv1*/uv1.x + /* REF: uv0*/uv0.y + /* REF: uv0*/uv0.z, /* REF: uv0*/uv0.x + /* REF: uv1*/uv1.y + /* REF: uv0*/uv0.z, /* REF: uv1*/uv1.x + /* REF: uv1*/uv1.y + /* REF: uv0*/uv0.z);
    vec4 /* DEF: r */r = /* REF: fract*/fract(/* REF: sin*/sin(/* REF: v*/v * 1e-3) * 1e5);
    float /* DEF: r0 */r0 = /* REF: mix*/mix(/* REF: mix*/mix(/* REF: r*/r.x, /* REF: r*/r.y, /* REF: f*/f.x), /* REF: mix*/mix(/* REF: r*/r.z, /* REF: r*/r.w, /* REF: f*/f.x), /* REF: f*/f.y);
    /* REF: r*/r = /* REF: fract*/fract(/* REF: sin*/sin((/* REF: v*/v + /* REF: uv1*/uv1.z - /* REF: uv0*/uv0.z) * 1e-3) * 1e5);
    float /* DEF: r1 */r1 = /* REF: mix*/mix(/* REF: mix*/mix(/* REF: r*/r.x, /* REF: r*/r.y, /* REF: f*/f.x), /* REF: mix*/mix(/* REF: r*/r.z, /* REF: r*/r.w, /* REF: f*/f.x), /* REF: f*/f.y);
    return /* REF: mix*/mix(/* REF: r0*/r0, /* REF: r1*/r1, /* REF: f*/f.z) * 2. - 1.;
    }
// popping activation record 0:snoise1:
// local variables: 
// variable s, unique name 0:snoise1::s, index 115, declared at line 6, column 12
// variable uv0, unique name 0:snoise1::uv0, index 116, declared at line 10, column 6
// variable uv1, unique name 0:snoise1::uv1, index 117, declared at line 11, column 6
// variable f, unique name 0:snoise1::f, index 118, declared at line 13, column 6
// variable v, unique name 0:snoise1::v, index 119, declared at line 15, column 6
// variable r, unique name 0:snoise1::r, index 120, declared at line 18, column 6
// variable r0, unique name 0:snoise1::r0, index 121, declared at line 19, column 7
// variable r1, unique name 0:snoise1::r1, index 122, declared at line 22, column 7
// references:
// vec3 at line 6, column 16
// uv at line 8, column 1
// res at line 8, column 7
// floor at line 10, column 12
// mod at line 10, column 18
// uv at line 10, column 22
// res at line 10, column 26
// s at line 10, column 32
// floor at line 11, column 12
// mod at line 11, column 18
// uv at line 11, column 22
// vec3 at line 11, column 25
// res at line 11, column 35
// s at line 11, column 41
// fract at line 13, column 10
// uv at line 13, column 16
// f at line 13, column 21
// f at line 13, column 25
// f at line 13, column 27
// f at line 13, column 38
// vec4 at line 15, column 10
// uv0 at line 15, column 15
// uv0 at line 15, column 21
// uv0 at line 15, column 27
// uv1 at line 15, column 34
// uv0 at line 15, column 40
// uv0 at line 15, column 46
// uv0 at line 16, column 11
// uv1 at line 16, column 17
// uv0 at line 16, column 23
// uv1 at line 16, column 30
// uv1 at line 16, column 36
// uv0 at line 16, column 42
// fract at line 18, column 10
// sin at line 18, column 16
// v at line 18, column 20
// mix at line 19, column 12
// mix at line 19, column 16
// r at line 19, column 20
// r at line 19, column 25
// f at line 19, column 30
// mix at line 19, column 36
// r at line 19, column 40
// r at line 19, column 45
// f at line 19, column 50
// f at line 19, column 56
// r at line 21, column 1
// fract at line 21, column 5
// sin at line 21, column 11
// v at line 21, column 16
// uv1 at line 21, column 20
// uv0 at line 21, column 28
// mix at line 22, column 12
// mix at line 22, column 16
// r at line 22, column 20
// r at line 22, column 25
// f at line 22, column 30
// mix at line 22, column 36
// r at line 22, column 40
// r at line 22, column 45
// f at line 22, column 50
// f at line 22, column 56
// mix at line 24, column 8
// r0 at line 24, column 12
// r1 at line 24, column 16
// f at line 24, column 20
// popping activation record 0:snoise
// local variables: 
// variable uv, unique name 0:snoise:uv, index 113, declared at line 4, column 18
// variable res, unique name 0:snoise:res, index 114, declared at line 4, column 28
// references:
float /* DEF: freqs */freqs[4];
/* DEF: mainImage */
// pushing activation record 0:mainImage
void mainImage(out vec4 /* DEF: fragColor */fragColor, in vec2 /* DEF: fragCoord */fragCoord){

    // pushing activation record 0:mainImage3:
    /* REF: freqs*/freqs[0] = /* UNDEF: texture*/texture(/* UNDEF: iChannel1*/iChannel1, /* REF: vec2*/vec2(0.01, 0.25)).x;
    /* REF: freqs*/freqs[1] = /* UNDEF: texture*/texture(/* UNDEF: iChannel1*/iChannel1, /* REF: vec2*/vec2(0.07, 0.25)).x;
    /* REF: freqs*/freqs[2] = /* UNDEF: texture*/texture(/* UNDEF: iChannel1*/iChannel1, /* REF: vec2*/vec2(0.15, 0.25)).x;
    /* REF: freqs*/freqs[3] = /* UNDEF: texture*/texture(/* UNDEF: iChannel1*/iChannel1, /* REF: vec2*/vec2(0.30, 0.25)).x;
    float /* DEF: brightness */brightness = /* REF: freqs*/freqs[1] * 0.25 + /* REF: freqs*/freqs[2] * 0.25;
    float /* DEF: radius */radius = 0.24 + /* REF: brightness*/brightness * 0.2;
    float /* DEF: invRadius */invRadius = 1.0 / /* REF: radius*/radius;
    vec3 /* DEF: orange */orange = /* REF: vec3*/vec3(0.8, 0.65, 0.3);
    vec3 /* DEF: orangeRed */orangeRed = /* REF: vec3*/vec3(0.8, 0.35, 0.1);
    float /* DEF: time */time = /* REF: iGlobalTime*/iGlobalTime * 0.1;
    float /* DEF: aspect */aspect = /* REF: iResolution*/iResolution.x / /* REF: iResolution*/iResolution.y;
    vec2 /* DEF: uv */uv = /* REF: fragCoord*/fragCoord.xy / /* REF: iResolution*/iResolution.xy;
    vec2 /* DEF: p */p = -0.5 + /* REF: uv*/uv;
    /* REF: p*/p.x *= /* REF: aspect*/aspect;
    float /* DEF: fade */fade = /* REF: pow*/pow(/* REF: length*/length(2.0 * /* REF: p*/p), 0.5);
    float /* DEF: fVal1 */fVal1 = 1.0 - /* REF: fade*/fade;
    float /* DEF: fVal2 */fVal2 = 1.0 - /* REF: fade*/fade;
    float /* DEF: angle */angle = /* REF: atan*/atan(/* REF: p*/p.x, /* REF: p*/p.y) / 6.2832;
    float /* DEF: dist */dist = /* REF: length*/length(/* REF: p*/p);
    vec3 /* DEF: coord */coord = /* REF: vec3*/vec3(/* REF: angle*/angle, /* REF: dist*/dist, /* REF: time*/time * 0.1);
    float /* DEF: newTime1 */newTime1 = /* REF: abs*/abs(/* REF: snoise*/snoise(/* REF: coord*/coord + /* REF: vec3*/vec3(0.0, -/* REF: time*/time * (0.35 + /* REF: brightness*/brightness * 0.001), /* REF: time*/time * 0.015), 15.0));
    float /* DEF: newTime2 */newTime2 = /* REF: abs*/abs(/* REF: snoise*/snoise(/* REF: coord*/coord + /* REF: vec3*/vec3(0.0, -/* REF: time*/time * (0.15 + /* REF: brightness*/brightness * 0.001), /* REF: time*/time * 0.015), 45.0));
    
    // pushing activation record 0:mainImage3:4:for
    for (int /* DEF: i */i = 1; /* REF: i*/i <= 7; /* REF: i*/i++) {
    
        // pushing activation record 0:mainImage3:4:for5:
        float /* DEF: power */power = /* REF: pow*/pow(2.0, /* UNDEF: float*/float(/* REF: i*/i + 1));
        /* REF: fVal1*/fVal1 += (0.5 / /* REF: power*/power) * /* REF: snoise*/snoise(/* REF: coord*/coord + /* REF: vec3*/vec3(0.0, -/* REF: time*/time, /* REF: time*/time * 0.2), (/* REF: power*/power * (10.0) * (/* REF: newTime1*/newTime1 + 1.0)));
        /* REF: fVal2*/fVal2 += (0.5 / /* REF: power*/power) * /* REF: snoise*/snoise(/* REF: coord*/coord + /* REF: vec3*/vec3(0.0, -/* REF: time*/time, /* REF: time*/time * 0.2), (/* REF: power*/power * (25.0) * (/* REF: newTime2*/newTime2 + 1.0)));
        }
    // popping activation record 0:mainImage3:4:for5:
    // local variables: 
    // variable power, unique name 0:mainImage3:4:for5::power, index 145, declared at line 59, column 8
    // references:
    // pow at line 59, column 16
    // i at line 59, column 32
    // fVal1 at line 60, column 2
    // power at line 60, column 19
    // snoise at line 60, column 29
    // coord at line 60, column 37
    // vec3 at line 60, column 45
    // time at line 60, column 57
    // time at line 60, column 63
    // power at line 60, column 79
    // newTime1 at line 60, column 100
    // fVal2 at line 61, column 2
    // power at line 61, column 19
    // snoise at line 61, column 29
    // coord at line 61, column 37
    // vec3 at line 61, column 45
    // time at line 61, column 57
    // time at line 61, column 63
    // power at line 61, column 79
    // newTime2 at line 61, column 100
    // popping activation record 0:mainImage3:4:for
    // local variables: 
    // variable i, unique name 0:mainImage3:4:for:i, index 144, declared at line 58, column 10
    // references:
    // i at line 58, column 15
    // i at line 58, column 21
    float /* DEF: corona */corona = /* REF: pow*/pow(/* REF: fVal1*/fVal1 * /* REF: max*/max(1.1 - /* REF: fade*/fade, 0.0), 2.0) * 50.0;
    /* REF: corona*/corona += /* REF: pow*/pow(/* REF: fVal2*/fVal2 * /* REF: max*/max(1.1 - /* REF: fade*/fade, 0.0), 2.0) * 50.0;
    /* REF: corona*/corona *= 1.2 - /* REF: newTime1*/newTime1;
    vec3 /* DEF: sphereNormal */sphereNormal = /* REF: vec3*/vec3(0.0, 0.0, 1.0);
    vec3 /* DEF: dir */dir = /* REF: vec3*/vec3(0.0);
    vec3 /* DEF: center */center = /* REF: vec3*/vec3(0.5, 0.5, 1.0);
    vec3 /* DEF: starSphere */starSphere = /* REF: vec3*/vec3(0.0);
    vec2 /* DEF: sp */sp = -1.0 + 2.0 * /* REF: uv*/uv;
    /* REF: sp*/sp.x *= /* REF: aspect*/aspect;
    /* REF: sp*/sp *= (2.0 - /* REF: brightness*/brightness);
    float /* DEF: r */r = /* REF: dot*/dot(/* REF: sp*/sp, /* REF: sp*/sp);
    float /* DEF: f */f = (1.0 - /* REF: sqrt*/sqrt(/* REF: abs*/abs(1.0 - /* REF: r*/r))) / (/* REF: r*/r) + /* REF: brightness*/brightness * 0.5;
    if (/* REF: dist*/dist < /* REF: radius*/radius) {
    
        // pushing activation record 0:mainImage3:4:
        /* REF: corona*/corona *= /* REF: pow*/pow(/* REF: dist*/dist * /* REF: invRadius*/invRadius, 24.0);
        vec2 /* DEF: newUv */newUv;
        /* REF: newUv*/newUv.x = /* REF: sp*/sp.x * /* REF: f*/f;
        /* REF: newUv*/newUv.y = /* REF: sp*/sp.y * /* REF: f*/f;
        /* REF: newUv*/newUv += /* REF: vec2*/vec2(/* REF: time*/time, 0.0);
        vec3 /* DEF: texSample */texSample = /* UNDEF: texture*/texture(/* UNDEF: iChannel0*/iChannel0, /* REF: newUv*/newUv).rgb;
        float /* DEF: uOff */uOff = (/* REF: texSample*/texSample.g * /* REF: brightness*/brightness * 4.5 + /* REF: time*/time);
        vec2 /* DEF: starUV */starUV = /* REF: newUv*/newUv + /* REF: vec2*/vec2(/* REF: uOff*/uOff, 0.0);
        /* REF: starSphere*/starSphere = /* UNDEF: texture*/texture(/* UNDEF: iChannel0*/iChannel0, /* REF: starUV*/starUV).rgb;
        }
    // popping activation record 0:mainImage3:4:
    // local variables: 
    // variable newUv, unique name 0:mainImage3:4::newUv, index 154, declared at line 79, column 9
    // variable texSample, unique name 0:mainImage3:4::texSample, index 155, declared at line 84, column 7
    // variable uOff, unique name 0:mainImage3:4::uOff, index 156, declared at line 85, column 8
    // variable starUV, unique name 0:mainImage3:4::starUV, index 157, declared at line 86, column 7
    // references:
    // corona at line 78, column 2
    // pow at line 78, column 14
    // dist at line 78, column 19
    // invRadius at line 78, column 26
    // newUv at line 80, column 3
    // sp at line 80, column 13
    // f at line 80, column 18
    // newUv at line 81, column 4
    // sp at line 81, column 14
    // f at line 81, column 19
    // newUv at line 82, column 2
    // vec2 at line 82, column 11
    // time at line 82, column 17
    // newUv at line 84, column 40
    // texSample at line 85, column 18
    // brightness at line 85, column 32
    // time at line 85, column 51
    // newUv at line 86, column 17
    // vec2 at line 86, column 25
    // uOff at line 86, column 31
    // starSphere at line 87, column 2
    // starUV at line 87, column 36
    float /* DEF: starGlow */starGlow = /* REF: min*/min(/* REF: max*/max(1.0 - /* REF: dist*/dist * (1.0 - /* REF: brightness*/brightness), 0.0), 1.0);
    /* REF: fragColor*/fragColor.rgb = /* REF: vec3*/vec3(/* REF: f*/f * (0.75 + /* REF: brightness*/brightness * 0.3) * /* REF: orange*/orange) + /* REF: starSphere*/starSphere + /* REF: corona*/corona * /* REF: orange*/orange + /* REF: starGlow*/starGlow * /* REF: orangeRed*/orangeRed;
    /* REF: fragColor*/fragColor.a = 1.0;
    }
// popping activation record 0:mainImage3:
// local variables: 
// variable brightness, unique name 0:mainImage3::brightness, index 127, declared at line 36, column 7
// variable radius, unique name 0:mainImage3::radius, index 128, declared at line 37, column 7
// variable invRadius, unique name 0:mainImage3::invRadius, index 129, declared at line 38, column 7
// variable orange, unique name 0:mainImage3::orange, index 130, declared at line 40, column 6
// variable orangeRed, unique name 0:mainImage3::orangeRed, index 131, declared at line 41, column 6
// variable time, unique name 0:mainImage3::time, index 132, declared at line 42, column 7
// variable aspect, unique name 0:mainImage3::aspect, index 133, declared at line 43, column 7
// variable uv, unique name 0:mainImage3::uv, index 134, declared at line 44, column 6
// variable p, unique name 0:mainImage3::p, index 135, declared at line 45, column 6
// variable fade, unique name 0:mainImage3::fade, index 136, declared at line 48, column 7
// variable fVal1, unique name 0:mainImage3::fVal1, index 137, declared at line 49, column 7
// variable fVal2, unique name 0:mainImage3::fVal2, index 138, declared at line 50, column 7
// variable angle, unique name 0:mainImage3::angle, index 139, declared at line 52, column 7
// variable dist, unique name 0:mainImage3::dist, index 140, declared at line 53, column 7
// variable coord, unique name 0:mainImage3::coord, index 141, declared at line 54, column 6
// variable newTime1, unique name 0:mainImage3::newTime1, index 142, declared at line 56, column 7
// variable newTime2, unique name 0:mainImage3::newTime2, index 143, declared at line 57, column 7
// variable corona, unique name 0:mainImage3::corona, index 146, declared at line 64, column 7
// variable sphereNormal, unique name 0:mainImage3::sphereNormal, index 147, declared at line 67, column 6
// variable dir, unique name 0:mainImage3::dir, index 148, declared at line 68, column 6
// variable center, unique name 0:mainImage3::center, index 149, declared at line 69, column 6
// variable starSphere, unique name 0:mainImage3::starSphere, index 150, declared at line 70, column 6
// variable sp, unique name 0:mainImage3::sp, index 151, declared at line 72, column 6
// variable r, unique name 0:mainImage3::r, index 152, declared at line 75, column 9
// variable f, unique name 0:mainImage3::f, index 153, declared at line 76, column 7
// variable starGlow, unique name 0:mainImage3::starGlow, index 158, declared at line 90, column 7
// references:
// freqs at line 31, column 1
// vec2 at line 31, column 32
// freqs at line 32, column 1
// vec2 at line 32, column 32
// freqs at line 33, column 1
// vec2 at line 33, column 32
// freqs at line 34, column 1
// vec2 at line 34, column 32
// freqs at line 36, column 20
// freqs at line 36, column 38
// brightness at line 37, column 24
// radius at line 38, column 24
// vec3 at line 40, column 17
// vec3 at line 41, column 19
// iGlobalTime at line 42, column 15
// iResolution at line 43, column 16
// iResolution at line 43, column 30
// fragCoord at line 44, column 13
// iResolution at line 44, column 28
// uv at line 45, column 20
// p at line 46, column 1
// aspect at line 46, column 8
// pow at line 48, column 15
// length at line 48, column 20
// p at line 48, column 34
// fade at line 49, column 22
// fade at line 50, column 22
// atan at line 52, column 16
// p at line 52, column 22
// p at line 52, column 27
// length at line 53, column 15
// p at line 53, column 22
// vec3 at line 54, column 15
// angle at line 54, column 21
// dist at line 54, column 28
// time at line 54, column 34
// abs at line 56, column 18
// snoise at line 56, column 23
// coord at line 56, column 31
// vec3 at line 56, column 39
// time at line 56, column 51
// brightness at line 56, column 67
// time at line 56, column 89
// abs at line 57, column 18
// snoise at line 57, column 23
// coord at line 57, column 31
// vec3 at line 57, column 39
// time at line 57, column 51
// brightness at line 57, column 67
// time at line 57, column 89
// pow at line 64, column 17
// fVal1 at line 64, column 22
// max at line 64, column 30
// fade at line 64, column 41
// corona at line 65, column 1
// pow at line 65, column 14
// fVal2 at line 65, column 19
// max at line 65, column 27
// fade at line 65, column 38
// corona at line 66, column 1
// newTime1 at line 66, column 20
// vec3 at line 67, column 22
// vec3 at line 68, column 15
// vec3 at line 69, column 17
// vec3 at line 70, column 20
// uv at line 72, column 24
// sp at line 73, column 1
// aspect at line 73, column 9
// sp at line 74, column 1
// brightness at line 74, column 15
// dot at line 75, column 13
// sp at line 75, column 17
// sp at line 75, column 20
// sqrt at line 76, column 16
// abs at line 76, column 21
// r at line 76, column 29
// r at line 76, column 35
// brightness at line 76, column 40
// dist at line 77, column 5
// radius at line 77, column 12
// min at line 90, column 18
// max at line 90, column 23
// dist at line 90, column 34
// brightness at line 90, column 49
// fragColor at line 92, column 1
// vec3 at line 92, column 17
// f at line 92, column 23
// brightness at line 92, column 36
// orange at line 92, column 57
// starSphere at line 92, column 68
// corona at line 92, column 81
// orange at line 92, column 90
// starGlow at line 92, column 99
// orangeRed at line 92, column 110
// fragColor at line 93, column 1
// popping activation record 0:mainImage
// local variables: 
// variable fragColor, unique name 0:mainImage:fragColor, index 125, declared at line 29, column 25
// variable fragCoord, unique name 0:mainImage:fragCoord, index 126, declared at line 29, column 44
// references:
// undefined variables 
//    texture
//    iChannel1
//    float
//    iChannel0