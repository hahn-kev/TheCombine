import {
  treeViewReducer,
  defaultState,
  TreeViewState,
  createDomains
} from "../TreeViewReducer";
import { TreeViewAction, TreeActionType } from "../TreeViewActions";
import SemanticDomain from "../SemanticDomain";
import { StoreAction, StoreActions } from "../../../rootActions";

describe("Test the TreeViewReducer", () => {
  it("Creates a SemanticDomain from a JSON string using createDomains", () => {
    const parent = {
      name: "Foo",
      id: "x"
    };
    const subdomains = [
      { name: "Bar", id: "x.1", subdomains: [] },
      { name: "Baz", id: "x.2", subdomains: [] }
    ];
    const initialJson = [
      {
        ...parent,
        subdomains: subdomains
      }
    ];
    let expected = {
      currentdomain: {
        name: "Semantic Domains",
        id: "",
        subdomains: [
          {
            ...parent,
            parentDomain: {},
            subdomains: [...subdomains]
          }
        ]
      }
    };
    expected.currentdomain.subdomains[0].parentDomain = expected.currentdomain;
    expected.currentdomain.subdomains[0].subdomains.map(value => {
      return {
        ...value,
        parentDomains: expected.currentdomain.subdomains[0]
      };
    });
    expect(createDomains(initialJson)).toEqual(expected);
  });

  it("Returns defaultState when passed undefined", () => {
    expect(treeViewReducer(undefined, {} as TreeViewAction)).toEqual(
      defaultState
    );
  });

  it("Returns default state when reset action is passed", () => {
    const action: StoreAction = {
      type: StoreActions.RESET
    };

    expect(treeViewReducer({} as TreeViewState, action)).toEqual(defaultState);
  });

  it("Returns state passed in when passed an invalid action", () => {
    expect(
      treeViewReducer(
        { currentdomain: defaultState.currentdomain.subdomains[0] },
        ({ type: "Nothing" } as any) as TreeViewAction
      )
    ).toEqual({ currentDomain: defaultState.currentdomain.subdomains[0] });
  });

  it("Returns state with a new SemanticDomain when requested to change this value", () => {
    let payload: SemanticDomain = defaultState.currentdomain
      .parentDomain as SemanticDomain;
    expect(
      treeViewReducer(defaultState, {
        type: TreeActionType.TRAVERSE_TREE,
        payload: payload
      })
    );
  });
});