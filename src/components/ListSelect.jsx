import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';

export default function ListSelect({data, index, setStatusData, setChange}) {
    const [selectedIndex, setSelectedIndex] = React.useState(index);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        setStatusData(index);
        setChange(true);
    };

    return (
        <>
            <List className="pt-0" component="nav" aria-label="main mailbox folders">
                {data.map((item, index) => (
                    <ListItem
                        key={index}
                        button
                        selected={selectedIndex === index}
                        onClick={(event) => handleListItemClick(event, index)}
                    >
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={item}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
        </>
    );
}
