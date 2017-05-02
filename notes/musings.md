How GLSL could be improved:

1. forced to declare types
1. No way to refer to a library
1. Could reuse is very hard, just cut and paste 
1. Have to understand uniform and parameters 
1. Can't debug easily
1. Can't compile to other targets 
1. Code can't be re-used if struct is different: want proper structural typing.  
1. Constants . . . 
1. Better compiler: so people don't do cute hacks with macros. 
1. Guided compilation 

How JavaScript could be improved: 

1. Remove prototypes
1. Force it to be more immutable 

What I should do:

1. Make a better shading language. 

# Primitive Types 

## Numerical types 

byte, byte2, byte3, byte4 
short, short2, short3, short4
uint, uint2, uint3, uint4
int, int2, int3, int4
float, float2, float3, float4
double, double2, double3, double4 

## Needed? 

matrix
quaternion 

## Other types 

boolean
bit array
blob 
string
char

## Higher order functions 

The idea of higher-order functions should be implemented for:

1. map
1. slice
1. filter? 

Note that filter is a stream. 

A higher-order function that is a closure, should be fine. That function could have a different type ...
this is because a closure is like a struct? 

## Mutability 

I don't want to support mutability, especially not in the context of a closure. Things get complicated. 

If someone wants to change a value, they are creating a new value. 

Keep it simple NO SHARING. Sharing means a copy. 

## Principles

1. People want to program like they do shaders.
1. People want to copy C programs into this language
1. People want to control the types 
1. There will be a "for" and a "while" loop. 


## Collections 

1. Array 
1. Stream (multi-pass and single-pass)
1. Associative container (dictionary)

# Interfaces 

An interface is quite important: I want to write functions that work on things that have a specific form.
Extension methods are key. However, there is no reason not to support "." notation on everything. 

# Property

Properties are very important. I want extension properties as well. 

# Numerics 

There is a system numerical stack. 

I want a language for working with floating point numbers in an efficient and predictable manner. 

# Referring to a library. 

We can refer to a library via a URN. Then we need a URN resolver. A library can be source code. 
Github commits are somewhat permanent. There could be many copies of the library. 

I need to be able to refer to a library by source code. This would be a good idea. 

I want the version, and date, and author, and license of the source code to all be knowns. 

Multiple versions of the source code can exist.


