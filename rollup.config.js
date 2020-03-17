import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
// import json from '@rollup/plugin-json';

export default [


	{
        input: './src/index.js',
		output: [
            { file: pkg.dist.prod, format: 'umd' }
        ],
        plugins: [
            commonjs({ignore:['conditional-runtime-dependency']}),
            resolve({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
            }
            }),
            babel({
                exclude: "node_modules/**"
            }),
            uglify(),
            // json()

        ],
        
    }
];