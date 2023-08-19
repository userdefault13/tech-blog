const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        },
        title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'untitled'
        },
        post_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'post text here'
        },
        user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
        }, 
        created_at: {
        type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post',
    }
);

module.exports = Post;