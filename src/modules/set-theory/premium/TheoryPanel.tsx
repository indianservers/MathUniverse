import { useState } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, Preview } from './components';
type Concept=[string,string,string,string];
const basics:Concept[]=[
 ['Set and membership','A set is a collection of distinct objects; order and repeated entries do not change it.','x ∈ A; x ∉ A','For A={1,2,2}, the distinct elements are 1 and 2, so |A|=2.'],
 ['Universal set','U fixes the objects under consideration. Complements depend on U.','Aᶜ = U − A','If U={1,2,3} and A={1}, then Aᶜ={2,3}; enlarging U can enlarge the complement.'],
 ['Roster and set-builder notation','Roster form lists elements. Set-builder form selects elements satisfying a condition.','A={1,2,3}={x∈U | 1≤x≤3}','For integer U={−2,…,3}, x is even selects {−2,0,2}.'],
 ['Empty, finite and infinite sets','The empty set has no elements. A finite set has a nonnegative integer cardinality; infinite sets need different size arguments.','|∅|=0; |{∅}|=1','An empty box and a box containing one empty box represent different sets.'],
 ['Subset and proper subset','A⊆B means every A element belongs to B; proper inclusion additionally requires inequality.','A⊂B ⇔ A⊆B and A≠B','{1}⊂{1,2}; {1,2}⊆{1,2}, but equal sets are not proper subsets.'],
 ['Equality and cardinality','Two sets are equal exactly when they have the same members. Equal cardinality alone is insufficient.','A=B ⇔ A⊆B and B⊆A','{1,2} and {3,4} have equal size but different elements.']];
const operations:Concept[]=[
 ['Union','Keep elements in A or B, including elements in both.','A ∪ B','{1,2}∪{2,3}={1,2,3}; list the common element once.'],
 ['Intersection','Keep only elements belonging to both sets.','A ∩ B','{1,2}∩{2,3}={2}.'],
 ['Difference','Keep the first set elements absent from the second; order matters.','A − B','{1,2}−{2,3}={1}, while B−A={3}.'],
 ['Complement','Keep U elements absent from A.','Aᶜ = U − A','For U={1,2,3,4}, A={1,2}, the complement is {3,4}.'],
 ['Symmetric difference','Keep elements in exactly one of two sets.','A △ B=(A−B)∪(B−A)','For {1,2} and {2,3}, the result is {1,3}.'],
 ['Disjoint and nested sets','Disjoint sets have empty intersection; nested sets have all smaller-set members in the larger.','A∩B=∅; A⊆B','For A⊆B, A∩B=A and A∪B=B.'],
 ['Three-set regions','Three sets partition U into up to eight mutually exclusive membership patterns.','A ∩ B ∩ C; A ∪ B ∪ C','Being in A and B is compatible with being inside or outside C; intersection includes both patterns.'],
 ['De Morgan laws','The complement of a union is an intersection of complements, and conversely.','(A∪B)ᶜ=Aᶜ∩Bᶜ; (A∩B)ᶜ=Aᶜ∪Bᶜ','An element outside both A and B lies outside their union. Check each possible membership pattern.']];
const relations:Concept[]=[
 ['Ordered pairs and product','The first and second positions have different roles. A binary relation is any subset of A×B.','R⊆A×B','(1,2) differs from (2,1) unless the entries are equal.'],
 ['Domain, range and inverse','The relation domain contains used first entries; its range contains used second entries. The inverse reverses every pair.','R⁻¹={(b,a):(a,b)∈R}','For {(1,a),(2,a)}, the range is {a}; the inverse pairs start with a.'],
 ['Composition','Compose R:A→B and S:B→C through shared middle entries.','S∘R={(a,c):∃b, aRb and bSc}','If 1Ra and aSx, composition contains (1,x). This is existence, not uniqueness.'],
 ['Matrix and digraph','A matrix cell records pair membership; a directed edge points from first entry to second.','Mᵣ[i,j]=1 ⇔ (aᵢ,bⱼ)∈R','Click row 1, column 2 to toggle (1,2) and its graph edge.'],
 ['Reflexive and irreflexive','Reflexive requires every diagonal pair; irreflexive forbids every diagonal pair.','∀a:aRa; ∀a:¬aRa','A relation with some but not all self-loops is neither. Both are vacuously true on an empty carrier.'],
 ['Symmetry, asymmetry and antisymmetry','Symmetry requires reverse edges. Asymmetry forbids all reverse edges and loops. Antisymmetry forbids only distinct mutual pairs.','aRb and bRa ⇒ a=b (antisymmetry)','≤ is antisymmetric despite its self-loops. Antisymmetric does not mean not symmetric.'],
 ['Transitivity','Every composable two-step pair must have a direct shortcut.','aRb and bRc ⇒ aRc','If (1,2),(2,3) exist, transitivity requires (1,3). An empty relation is transitive.'],
 ['Equivalence and classes','Reflexive, symmetric and transitive relations partition the carrier into equivalence classes.','[a]={b:aRb}','Equal parity on {1,2,3,4} gives classes {1,3} and {2,4}.'],
 ['Partial orders','A partial order is reflexive, antisymmetric and transitive; elements may be incomparable.','(P,≤)','Divisibility on {1,2,3,6} is a partial order; 2 and 3 are incomparable.']];
const orders:Concept[]=[
 ['Poset and cover relation','A cover a≺b means a<b with no element strictly between. Hasse diagrams draw only covers, omitting loops and transitive shortcuts.','a≺b ⇔ a<b and no a<c<b','For divisors of 12, 1≺2 but 1 does not cover 4 because 2 lies between.'],
 ['Least versus minimal','Least means below every element. Minimal means nothing distinct is below it.','Least ≤ all; minimal has no strict predecessor','A poset may have several minimal elements but at most one least element.'],
 ['Greatest versus maximal','Greatest means above every element. Maximal means no distinct element is above it.','All ≤ greatest','In a divisibility poset of all divisors of 12, 12 is both greatest and maximal.'],
 ['Bounds, meet and join','Lower bounds lie below every selected element; their greatest element is the meet. Upper bounds are dual and their least element is the join.','a∧b; a∨b','For divisors 4 and 6 of 12, meet=2 and join=12.'],
 ['Lattice','A lattice has a meet and join for every pair, not merely the selected pair.','∀a,b: a∧b and a∨b exist','All divisors of a positive integer form a lattice with gcd and lcm. An arbitrary subset need not.'],
 ['Chain and antichain','In a chain each pair is comparable; in an antichain distinct elements are incomparable.','a≤b or b≤a','{1,2,4} is a divisibility chain; {2,3} is an antichain.'],
 ['Boolean lattice','The power set ordered by inclusion has intersection as meet and union as join.','B₃=P({a,b,c})','Eight subsets occupy four ranks by cardinality: 1,3,3,1.']];
const functions:Concept[]=[
 ['Function rule','A function assigns exactly one codomain output to each domain input.','f:A→B','One input with two distinct outputs is a relation but not a function; a missing input also invalidates a total function.'],
 ['Domain, codomain and range','Domain is the declared input set; codomain is the declared output space; range consists of outputs actually reached.','f(A)⊆B','An unused codomain element makes a valid function not onto.'],
 ['Injective and many-to-one','Injective means distinct inputs have distinct outputs. A valid many-to-one function has a collision.','f(x)=f(y) ⇒ x=y','1→a,2→a is a valid many-to-one function, not an injective function.'],
 ['Surjective and into','Surjective reaches every codomain element. Here into means a valid function whose range is a proper subset of its codomain.','f(A)=B; f(A)⊂B','Changing the codomain while retaining arrows can change surjectivity.'],
 ['Bijection and inverse','A bijection is both injective and surjective; reversing its arrows gives a function defined on all B.','f⁻¹:B→A','Reversing a many-to-one map gives one-to-many arrows, not an inverse function.'],
 ['Composition','Apply the first function, then the second. The intermediate values must be valid inputs for the second.','(g∘f)(x)=g(f(x))','If f(1)=a and g(a)=7, then (g∘f)(1)=7.'],
 ['Empty-domain edge case','The empty map is a function from ∅ to B and is injective; it is onto only if B is also empty.','∅→B','The universal condition has no input counterexample; surjectivity still asks whether every B value is reached.']];
const representations:Concept[]=[
 ['Cartesian product','Choose one first entry from A and one second entry from B. Order matters.','|A×B|=|A||B|','If A={1,2},B={a,b,c}, the six pairs appear at six grid positions.'],
 ['Power set','The power set consists of every subset, including ∅ and A itself.','|P(A)|=2^|A|','For A={a,b}, P(A)={∅,{a},{b},{a,b}}. The empty set has one subset.'],
 ['Subset-size groups','Group subsets by their number of elements. Exactly C(n,k) subsets have size k.','ΣₖC(n,k)=2ⁿ','For n=3 the group sizes are 1,3,3,1.'],
 ['Tables and matrices','A relation table is a Boolean encoding of the same ordered-pair data, not a separate relation.','Row = first entry; column = second','A zero cell means the pair is absent; the transpose encodes the inverse.'],
 ['Partitions and classes','A partition covers the carrier with nonempty disjoint blocks. Equivalence classes form such a partition.','A = disjoint union of [a]','Never report equivalence classes before verifying reflexivity, symmetry and transitivity.']];
const bank:Record<string,Concept[]>={'set-builder':basics,'venn-diagram-engine':operations,relations,'hasse-diagram':orders,functions,representations,practice:[...basics,...operations,...relations,...functions,...orders,...representations]};
const quickChecks:Record<string,[string,string,string]>={
 'set-builder':['How many subsets does the empty set have?','1','The empty set has the empty subset itself: 2⁰=1.'],
 'venn-diagram-engine':['For A={1,2}, B={2,3}, how many elements are in A ∩ B?','1','Only 2 belongs to both sets, so the intersection has one element.'],
 relations:['How many diagonal pairs are required for reflexivity on a three-element carrier?','3','Each of the three elements requires its own pair (x,x).'],
 'hasse-diagram':['In the divisors of 12, what is the meet of 4 and 6?','2','The common lower bounds are 1 and 2; the greatest is 2.'],
 functions:['Exactly how many outputs must each input have in a total function?','1','Every declared input must have exactly one valid output.'],
 representations:['How many subsets does a three-element set have?','8','Each element may be included or excluded: 2³=8.'],
 practice:['How many subsets does the empty set have?','1','The empty set has the empty subset itself: 2⁰=1.']};
export function TheoryPanel({page,onTry}:{page:string;onTry?:(title:string)=>void}){const concepts=bank[page]||basics,[selected,setSelected]=useState(0),[answer,setAnswer]=useState(''),[checked,setChecked]=useState(false);const c=concepts[selected]||concepts[0],quick=quickChecks[page]||quickChecks.practice;return <details className="st-theory"><summary><BookOpen size={22}/><span>Theory & Learn</span><small>Definitions · visual explanations · worked examples · quick checks</small></summary><Card title="Build understanding" icon={Lightbulb}><div className="st-theory-layout"><nav aria-label="Theory concepts">{concepts.map(([title],i)=><button key={`${i}:${title}`} className={selected===i?'active':''} onClick={()=>setSelected(i)}>{title}</button>)}</nav><article><h3>{c[0]}</h3><p>{c[1]}</p><div className="st-formula">{c[2]}</div><h4>Worked example</h4><p>{c[3]}</p><div className="st-theory-visual"><Preview kind={page}/><p><b>Why it matters</b><br/>Represent the same objects in notation, diagrams and tables. Check the model's assumptions before applying a rule to classification, databases, scheduling or counting.</p></div><details><summary>Common mistakes</summary><p>Do not confuse an element with a set containing it, a subset with a proper subset, or a picture with a proof. Complements require U; relation properties require a carrier; function properties require a declared codomain.</p></details>{onTry?<Button primary onClick={()=>onTry(c[0])}>Load a related live example →</Button>:null}<Link className="st-learning-link" to="/studios/set-theory/curriculum">More proofs and guided exercises →</Link></article></div><div className="st-quick-check"><b>Quick check: {quick[0]}</b><input aria-label="Theory quick-check answer" value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false);}}/><Button onClick={()=>setChecked(true)}>Check</Button>{checked?<p role="status">{answer.trim()===quick[1]?`Correct. ${quick[2]}`:`Try again. ${quick[2]}`}</p>:null}</div></Card></details>;}
