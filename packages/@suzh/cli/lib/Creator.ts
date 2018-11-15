import { writeFileTree } from './util/writeFileTree';

export class Creator {
    constructor(
        private name: string, 
        private context: string
    ) { }

    // 生成package.json
    private async generatePackageJson() {
        const pkg = {
            name: this.name,
            version: '0.1.0',
            private: true,
            devDependencies: {}
        }

        return await writeFileTree(this.context, {
            'package.json': JSON.stringify(pkg, null, 2)
        });
    }

    // 生成package的依赖内容
    private generatePreset() {
        
    }

    async create() {
        return await this.generatePackageJson();
    }
}
