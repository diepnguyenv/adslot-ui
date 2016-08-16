import _ from 'lodash';
import immutable from 'seamless-immutable';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TreePickerPropTypes from 'helpers/propTypes/TreePickerPropTypes';
import TreePickerPure from 'components/adslotUi/TreePickerPureComponent';
import React, { PropTypes } from 'react';
import { SvgSymbol } from 'alexandria-adslot';

const pathIncludesId = ({ id, path }) => _(path).map('id').includes(id);

const getIds = (nodes) => _.map(nodes, 'id');

class TreePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    for (const methodName of [
      'applyAction',
      'breadcrumbOnClick',
      'cancelAction',
      'changeRootType',
      'expandNode',
      'includeNode',
      'loadData',
      'removeNode',
      'searchOnChange',
      'searchOnClear',
      'searchOnQuery',
    ]) { this[methodName] = this[methodName].bind(this); }

    _.assign(this, {
      shouldComponentUpdate: PureRenderMixin.shouldComponentUpdate.bind(this),
      state: {},
      throttledSearchOnQuery: _.throttle(() => this.searchOnQuery(this.state.searchValue), props.throttleTime),
    });
  }

  componentDidMount() {
    this.currentlyMounted = true;
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (!_(nextProps.initialSelection)
      .thru(getIds)
      .xor(getIds(this.props.initialSelection))
      .isEmpty()
    ) { this.loadData(nextProps.initialSelection); }
  }

  componentWillUnmount() { this.currentlyMounted = false; }

  loadData(initialSelection = this.props.initialSelection) {
    const rootType = immutable(_.first(this.props.rootTypes));
    const selectedNodesByRootType = immutable(
      _(initialSelection)
        .sortBy('label')
        .groupBy('rootTypeId')
        .value()
    );

    this.props.getSubtree({ rootTypeId: _.get(rootType, 'id') }, (subtree) => {
      if (this.currentlyMounted) {
        this.setState({
          breadcrumbNodes: [],
          rootType,
          searchValue: '',
          selectedNodesByRootType,
          subtree,
        });
      }
    });
  }

  changeRootType(rootTypeId) {
    this.props.getSubtree({ rootTypeId }, (subtree) => {
      this.setState({
        breadcrumbNodes: [],
        rootType: immutable(_.find(this.props.rootTypes, { id: rootTypeId })),
        searchValue: '',
        subtree,
      });
    });
  }

  searchOnChange(value) { this.setState({ searchValue: value }, this.throttledSearchOnQuery); }

  searchOnClear() { this.searchOnChange(''); }

  searchOnQuery(query) {
    this.props.getSubtree({ rootTypeId: this.state.rootType.id, query }, (subtree) => {
      this.setState({
        breadcrumbNodes: [],
        subtree,
      });
    });
  }

  breadcrumbOnClick(newActiveId) {
    const { breadcrumbNodes, rootType } = this.state;
    const { getSubtree } = this.props;
    if (newActiveId === 'all') {
      getSubtree({ rootTypeId: rootType.id }, (subtree) => {
        this.setState({
          breadcrumbNodes: [],
          subtree,
        });
      });
    } else {
      getSubtree({ rootTypeId: rootType.id, nodeId: newActiveId }, (subtree) => {
        const activeBreadCrumbNodeIndex = 1 + _.findIndex(breadcrumbNodes, { id: newActiveId });
        this.setState({
          breadcrumbNodes: immutable(_.slice(breadcrumbNodes, 0, activeBreadCrumbNodeIndex)),
          subtree,
        });
      });
    }
  }

  expandNode(node) {
    const { breadcrumbNodes, rootType } = this.state;
    this.props.getSubtree({ rootTypeId: rootType.id, nodeId: node.id }, (subtree) => {
      this.setState({
        breadcrumbNodes: breadcrumbNodes.concat([immutable(node)]),
        searchValue: '',
        subtree,
      });
    });
  }

  includeNode(node) {
    const { rootTypeId } = node;
    const { selectedNodesByRootType } = this.state;
    const newSelected = selectedNodesByRootType
      .set(rootTypeId, (selectedNodesByRootType[rootTypeId] || []).concat([node]));

    const newSelectedAfterRemovals = newSelected.set(rootTypeId, _.reject(
      newSelected[rootTypeId], ({ id, path }) =>
        pathIncludesId({ id: node.id, path }) || pathIncludesId({ id, path: node.path })
    ));

    this.setState({ selectedNodesByRootType: newSelectedAfterRemovals });
  }

  removeNode(node) {
    const { rootTypeId } = node;
    const { selectedNodesByRootType } = this.state;
    const newSelected = selectedNodesByRootType
      .set(rootTypeId, _.reject(selectedNodesByRootType[rootTypeId], { id: node.id }));

    const newSelectedAfterRemovals = _.isEmpty(newSelected[rootTypeId]) ? newSelected.without(rootTypeId) : newSelected;

    this.setState({ selectedNodesByRootType: newSelectedAfterRemovals });
  }

  cancelAction() {
    this.props.modalClose();
    this.loadData();
  }

  applyAction() {
    this.props.modalApply(_.mapValues(this.state.selectedNodesByRootType, getIds));
    this.props.modalClose();
  }

  shouldDisableIncludeNode() {
    const { state, props } = this;
    const rootTypeId = _.get(state, 'rootType.id');

    const maximumSelections = _.get(props, `maximumSelectionsByRootType[${rootTypeId}]`);
    const selectedNodes = _.get(state, `selectedNodesByRootType[${rootTypeId}]`);
    return maximumSelections && selectedNodes && (selectedNodes.length >= maximumSelections);
  }

  render() {
    const { state, props } = this;
    const treePickerPureProps = _.assign(

      {
        activeRootTypeId: _.get(state, 'rootType.id'),
        emptySvgSymbol: _.get(state, 'rootType.emptySvgSymbol'),
        disableInclude: this.shouldDisableIncludeNode(),
      },

      _.pick(props, [
        'averageWithinRootType',
        'baseItem',
        'helpText',
        'itemType',
        'rootTypes',
        'selectedLabel',
        'svgSymbolCancel',
        'svgSymbolSearch',
        'totalsSuffix',
        'valueFormatter',
        'warnOnRequired',
      ]),

      _.pick(this, [
        'breadcrumbOnClick',
        'changeRootType',
        'expandNode',
        'includeNode',
        'removeNode',
        'searchOnChange',
        'searchOnClear',
      ]),

      _.pick(state, [
        'breadcrumbNodes',
        'searchValue',
        'selectedNodesByRootType',
        'subtree',
      ])
    );

    return (
      <Modal className="treepicker-component" show={props.show} bsSize="large" keyboard={false}>
        <Modal.Header>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TreePickerPure {...treePickerPureProps} />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-inverse" onClick={this.cancelAction} data-test-selector="treepicker-cancel-button">
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.applyAction} data-test-selector="treepicker-apply-button">
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TreePickerComponent.displayName = 'AdslotUiTreePickerComponent';

TreePickerComponent.propTypes = {
  averageWithinRootType: PropTypes.bool.isRequired,
  baseItem: PropTypes.shape(),
  getSubtree: PropTypes.func,
  helpText: PropTypes.shape({
    average: PropTypes.string,
    sum: PropTypes.string,
  }),
  initialSelection: PropTypes.arrayOf(TreePickerPropTypes.node).isRequired,
  modalApply: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  rootTypes: PropTypes.arrayOf(TreePickerPropTypes.rootType),
  selectedLabel: PropTypes.string,
  show: PropTypes.bool.isRequired,
  svgSymbolCancel: PropTypes.shape(SvgSymbol.propTypes),
  svgSymbolSearch: PropTypes.shape(SvgSymbol.propTypes),
  throttleTime: PropTypes.number.isRequired,
  totalsSuffix: PropTypes.string,
  valueFormatter: PropTypes.func,
  warnOnRequired: PropTypes.bool.isRequired,
  maximumSelectionsByRootType: PropTypes.object,
};
TreePickerComponent.defaultProps = {
  averageWithinRootType: false,
  getSubtree: ({ rootTypeId, query, nodeId }, cb) => cb([]),
  initialSelection: [],
  modalApply: (selected) => {
    throw new Error(`AdslotUi TreePicker needs a modalApply handler for ${JSON.stringify(selected)}`);
  },

  modalClose: () => { throw new Error('AdslotUi TreePicker needs a modalClose handler'); },

  modalTitle: 'Edit Tree',
  rootTypes: [],
  show: false,
  throttleTime: 300,
  warnOnRequired: false,
};

export default TreePickerComponent;