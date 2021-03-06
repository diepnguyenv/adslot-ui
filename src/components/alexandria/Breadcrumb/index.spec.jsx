/* eslint-disable lodash/prefer-lodash-method */
import React from 'react';
import { shallow } from 'enzyme';
import BreadcrumbNode from 'components/alexandria/Breadcrumb/Node';
import Breadcrumb from '.';

describe('Breadcrumb', () => {
  let nodes;

  beforeEach(() => {
    nodes = [
      { id: 'a', label: 'Canada' },
      { id: 'b', label: 'British Columbia' },
      { id: 'c', label: 'Victoria' },
    ];
  });

  it('should render empty with the component className when no nodes', () => {
    const component = shallow(<Breadcrumb />);
    expect(component.prop('className')).to.equal('breadcrumb-component');
    expect(component.find(BreadcrumbNode)).to.have.length(0);
  });

  it('should render nodes', () => {
    const component = shallow(<Breadcrumb nodes={nodes} />);
    expect(component.prop('className')).to.equal('breadcrumb-component');
    expect(component.find(BreadcrumbNode)).to.have.length(4);

    const allLink = component.children().first();
    expect(allLink.type()).to.equal(BreadcrumbNode);
    expect(allLink.prop('isLast')).to.equal(false);
    expect(allLink.prop('node')).to.deep.equal({ id: 'all', label: 'All' });
    expect(allLink.prop('onClick')).to.be.a('function');

    const nodeWrapperElements = component.find('.breadcrumb-component-node');
    expect(nodeWrapperElements).to.have.length(nodes.length);
    nodeWrapperElements.forEach((nodeWrapperElement, index) => {
      const dividerElement = nodeWrapperElement.find('.breadcrumb-component-node-divider');
      expect(dividerElement.text()).to.equal(' > ');

      const nodeElement = nodeWrapperElement.find(BreadcrumbNode);
      expect(nodeElement.prop('node')).to.equal(nodes[index]);

      expect(nodeElement.prop('isLast')).to.equal(index === nodes.length - 1);
      expect(nodeElement.prop('onClick')).to.be.a('function');
    });
  });
  it('should error when clicking a node with no onClick handler', () => {
    const component = shallow(<Breadcrumb nodes={nodes} />);
    const allLinkElement = component.children().first();
    expect(() => {
      allLinkElement.simulate('click', 'all');
    }).to.throw('Alexandria Breadcrumb needs an onClick handler to take all');
  });
});
