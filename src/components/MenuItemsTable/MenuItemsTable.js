import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { Data } from "react-data-grid-addons";
import Firebase from "../../firebase/firebase.js";
import { ToCamelCase } from '../../helpers/Helpers.js';

import 'bootstrap/dist/css/bootstrap.css';
import './MenuItemsTable.css';

const selectors = Data.Selectors;

class MenuItemsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      columns: [
        { key: 'menuItem', name: 'MENU ITEM', editable: true },
        { key: 'available', name: 'AVAILABLE', editable: true },
        { key: 'wrap', name: 'WRAP', editable: true },
        { key: 'halfTray', name: 'HALF TRAY', editable: true },
        { key: 'fullTray', name: 'FULL TRAY', editable: true },
        { key: 'twoLbowl', name: '2L BOWL', editable: true },
        { key: 'addInfo', name: 'ADD INFO', editable: true },
        { key: 'category', name: 'CATEGORY', editable: true },
      ],
    };
  }

  componentDidMount() {
    Firebase.getMenu().then(val => {
      const rows = [{ menuItem: 'enter new menu item here', available: '', wrap: '', halfTray: '', fullTray: '', twoLbowl: '', addInfo: '', category: '' }, ...val, ];
      this.setState({ rows });
    })
  }

  refreshTable(){
    Firebase.getMenu().then( val => {
      this.setState({rows: val})
    })
  }

  handleAddItem = () => {
    const newItem = { menuItem: '', available: '', wrap: '', halfTray: '', fullTray: '', twoLbowl: '', addInfo: '', category: '' };

    if (this.state.rows[0].menuItem === '' || this.state.rows[0].menuItem === 'enter new menu item here') {
      return;
    }

    const rows = [newItem, ...this.state.rows];
    this.setState({ rows });
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const rows = [...this.state.rows];
    for (let i = fromRow; i <= toRow; i++) {
      const updatedRow = { ...rows[i], ...updated };
      if (updatedRow.menuItem !== '' && updatedRow.menuItem !== 'enter new menu item here') {
        rows[i] = updatedRow;
        const itemId = ToCamelCase(updatedRow.menuItem);
        Firebase.updateGridRows(updatedRow, itemId).then( () => {this.refreshTable} );
      }
    }
    this.setState({ rows });
  };
  
  render() {
    return (
      <div className="MenuItemsTable">
        <ReactDataGrid
          rowKey="menuItem"
          columns={this.state.columns}
          rowGetter={(i) => this.state.rows[i]}
          rowsCount={this.state.rows.length}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          enableCellSelect={true}
          minHeight={500}
        />
        <button onClick={this.handleAddItem}>Add Item</button>
      </div>
    );
  }
}

export default MenuItemsTable;
