import { Block } from "../components/Block/Block";
import { Column } from "../components/Column";
import { Row } from "../components/Row";
import { isEqual } from "lodash";

const cache = new WeakMap();

export function map(list, path = []) {
  return list.map((item, idx) => {
    const newPath = [...path, idx];

    const cached = cache.get(item);

    if (cached && isEqual(cached.props.path, newPath)) {
      return cached;
    }

    let newComponent = null;

    if (item.type === "block") {
      newComponent = <Block color={item.color} path={newPath} />;
    }

    if (item.type === "row") {
      newComponent = (
        <Row key={idx} path={newPath} index={idx}>
          {map(item.columns, [...newPath, "columns"])}
        </Row>
      );
    }

    if (item.type === "column") {
      newComponent = (
        <Column key={idx} path={newPath} index={idx} width={item.width}>
          {map(item.items, [...newPath, "items"])}
        </Column>
      );
    }

    cache.set(item, newComponent);

    return newComponent;
  });
}
