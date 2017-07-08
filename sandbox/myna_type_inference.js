// Type inference

// Types are lists, constants, or variables. 
// We start with a set of equivalencies. The goal of the type-inference engine is to:
// 1) identify inconsistencies as early as possible. 
// 2) Move forwards and backwards 

// 3) Answer some basic questions:
// * What is the type of this variable declaration 
// * Is it assigned 
// * What is the type of this function argument
// * What is the return type of this function  

// We end up with facts and deductions and suppositions.
// When we arrive at an inconsistency . . . I want the known information on either side to be listed. 
// If something remains generic, it is good to keep it generic. 

// Now in complex scenarios, there are restrictions on the type for example it's constraints. 
// basically inferring it's traits. 

// Is moving in one direction preferable to another?

// variables are declared 
// variables are assigned
// variables are used 

// function initTypeChecker(initialConstraints)

// For each variable I want to know: how is it used, where it is declared, what is its scope name. 
