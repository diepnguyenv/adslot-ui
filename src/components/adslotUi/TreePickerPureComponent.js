import _ from 'lodash';
import TreePickerNav from 'components/adslotUi/TreePickerNavComponent';
import TreePickerNode from 'components/adslotUi/TreePickerNodeComponent';
import TreePickerPane from 'components/adslotUi/TreePickerPaneComponent';
import TreePickerSelected from 'components/adslotUi/TreePickerSelectedComponent';
import React, { PropTypes } from 'react';
import { Empty, FlexSpacer, Grid } from 'alexandria-adslot';

require('styles/adslotUi/TreePickerPure.scss');

const TreePickerPureComponent = ({
  activeRootTypeId,
  averageWithinRootType,
  baseItem,
  breadcrumbNodes,
  breadcrumbOnClick,
  changeRootType,
  emptyIcon,
  expandNode,
  helpText,
  includeNode,
  removeNode,
  rootTypes,
  searchOnChange,
  searchOnClear,
  searchPlaceholder,
  searchValue,
  selectedLabel,
  selectedNodesByRootType,
  subtree,
  valueFormatter,
  warnOnRequired,
}) => {
  const changeRootTypeBound = (rootType) => {
    if (rootType.id !== activeRootTypeId) {
      return changeRootType.bind(null, rootType.id);
    }

    return () => null;
  };

  const selectedIds = _.map(selectedNodesByRootType[activeRootTypeId], 'id');
  const filteredSubtree = _(subtree)
    .filter(({ id }) => !_.includes(selectedIds, id))
    .sortBy('label')
    .value();

  return (
    <div className="treepickerpure-component">

      <TreePickerPane>

        <ul className="nav nav-tabs">
          {rootTypes.length ? rootTypes.map((rootType) =>
            <li className={(rootType.id === activeRootTypeId) ? 'active' : ''} key={rootType.id}>
              <a onClick={changeRootTypeBound(rootType)}>
                <img className="icon" src={rootType.icon} />
                {rootType.label}
              </a>
            </li>)
          : <li><a>Loading</a></li>}
        </ul>

        <TreePickerNav
          breadcrumbNodes={breadcrumbNodes}
          breadcrumbOnClick={breadcrumbOnClick}
          searchOnChange={searchOnChange}
          searchOnClear={searchOnClear}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
        />

        <Grid>
          {filteredSubtree.map((node) =>
            <TreePickerNode
              expandNode={expandNode}
              includeNode={includeNode}
              key={node.id}
              node={node}
              valueFormatter={valueFormatter}
            />
          )}
          <Empty collection={filteredSubtree} icon={emptyIcon} text="No items to select." />
        </Grid>

        <FlexSpacer />
      </TreePickerPane>

      <TreePickerPane>

        <TreePickerSelected
          averageWithinRootType={averageWithinRootType}
          baseItem={baseItem}
          emptyIcon={emptyIcon}
          helpText={helpText}
          removeNode={removeNode}
          rootTypes={rootTypes}
          selectedLabel={selectedLabel}
          selectedNodesByRootType={selectedNodesByRootType}
          valueFormatter={valueFormatter}
          warnOnRequired={warnOnRequired}
        />

      </TreePickerPane>

    </div>
  );
};

TreePickerPureComponent.displayName = 'AdslotUiTreePickerPureComponent';

const baseItemPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

const breadCrumbNode = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const nodePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  rootTypeId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

const rootType = PropTypes.shape({
  emptyIcon: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
});

TreePickerPureComponent.propTypes = {
  activeRootTypeId: PropTypes.string,
  averageWithinRootType: PropTypes.bool.isRequired,
  baseItem: baseItemPropType,
  breadcrumbNodes: PropTypes.arrayOf(breadCrumbNode),
  breadcrumbOnClick: PropTypes.func,
  changeRootType: PropTypes.func.isRequired,
  emptyIcon: PropTypes.string,
  expandNode: PropTypes.func,
  helpText: PropTypes.shape({
    average: PropTypes.string,
    sum: PropTypes.string,
  }),
  includeNode: PropTypes.func,
  removeNode: PropTypes.func,
  rootTypes: PropTypes.arrayOf(rootType).isRequired,
  searchOnChange: PropTypes.func,
  searchOnClear: PropTypes.func,
  searchValue: PropTypes.string,
  selectedLabel: PropTypes.string,
  selectedNodesByRootType: PropTypes.shape(),
  subtree: PropTypes.arrayOf(nodePropType).isRequired,
  valueFormatter: PropTypes.func,
  warnOnRequired: PropTypes.bool,
};

TreePickerPureComponent.defaultProps = {
  averageWithinRootType: false,
  rootTypes: [],
  selectedNodesByRootType: {},
  subtree: [],
};

export default TreePickerPureComponent;
