import _ from 'lodash';
import React from 'react';
import CategorySearch from 'components/adslotUi/CategorySearchComponent';

import Select from 'react-select';
import Button from 'react-bootstrap/lib/Button';

import sinon from 'sinon';
import { shallow } from 'enzyme';

const defaultProps = {
  category: '0',
  categoryOptions: [
    { value: '0', label: 'All Fruit' },
    { value: '1', label: 'Banana' },
    { value: '2', label: 'Apple' },
    { value: '3', label: 'Orange' },
  ],
  onCategorySelect: _.noop,
  searchString: '',
  onSearchStringChange: _.noop,
  onSearchButtonClick: _.noop,
};

describe('CategorySearchComponent', () => {
  it('should render with defaults', () => {
    const component = shallow(<CategorySearch {...defaultProps} />);

    const selectElement = component.find(Select);
    expect(selectElement).to.have.length(1);

    const inputElement = component.find('input');
    expect(inputElement).to.have.length(1);

    const buttonElement = component.find(Button);
    expect(buttonElement).to.have.length(1);
  });

  it('should pass onCategorySelect down to dropdown', () => {
    let callback = sinon.spy();
    const component = shallow(<CategorySearch {...defaultProps} onCategorySelect={callback} />);
    const selectElement = component.find(Select);
    selectElement.simulate('change', '2');
    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWith('2'));
  });

  it('should pass onSearchStringChange down to search input', () => {
    let callback = sinon.spy();
    const component = shallow(<CategorySearch {...defaultProps} onSearchStringChange={callback} />);
    const inputElement = component.find('input');
    inputElement.simulate('change', { target: { value: 'Granny Smith' } });
    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWith('Granny Smith'));
  });

  it('should pass onSearchButtonClick down to search button', () => {
    let callback = sinon.spy();
    const component = shallow(<CategorySearch {...defaultProps} onSearchButtonClick={callback} />);
    const buttonElement = component.find(Button);
    buttonElement.simulate('click');
    expect(callback.calledOnce).to.equal(true);
  });
});