import { getValueIter, init, insert, length, LinkedList, } from "./iter";

const iterObj = new LinkedList(0)
const iterSymbol = init(0)
for (let i = 1; i <= 10; i++) {
  iterObj.insert(iterObj.length - 1, i)
  insert(iterSymbol, length(iterSymbol) - 1, i)
}

for (const item of iterObj.valueIter) {
  console.log(item)
}

for (const item of getValueIter(iterSymbol)) {
  console.log(item)
}