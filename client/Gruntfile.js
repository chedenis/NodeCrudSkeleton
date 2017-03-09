module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngconstant: {
            options: {
                name: 'config',
                wrap: '"use strict";\n\n{%= __ngModule %}',
                space: '  '
            },
            development: {
                options: {
                    dest: 'scripts/config.js'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        apiEndpoint: {
                            facesheet: "http://localhost:8011",
                            facility: "http://localhost:8013",
                            resident: "http://localhost:8012",
                            packet: "http://localhost:8050",
                            marketing: "http://localhost:8099",
                            auth: "http://localhost:8055/:action",
                            groupPlus: 'http://localhost:8040',
                            offset: 'http://localhost:8087'
                        }
                    }
                }
            },
            qa: {
                options: {
                    dest: 'scripts/config.js'
                },
                constants: {
                    ENV: {
                        name: 'qa',
                        apiEndpoint: {
                            facesheet: "https://facesheetqa.freds.cslico.com/api",
                            facility: "https://facilityqa.freds.cslico.com/api",
                            resident: "https://residentqa.freds.cslico.com/api",
                            packet: "https://packetqa.freds.cslico.com/api",
                            marketing: "https://marketingqa.freds.cslico.com/api",
                            auth: "https://authqa.freds.cslico.com/api/:action",
                            groupPlus: 'https://gplusqa.freds.cslico.com/api',
                            offset: 'https://offsetqa.freds.cslico.com/api'
                        }
                    }
                }
            },
            production: {
                options: {
                    dest: 'scripts/config.js'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        apiEndpoint: {
                            facesheet: "https://facesheet.freds.cslico.com/api",
                            facility: "https://facility.freds.cslico.com/api",
                            resident: "https://resident.freds.cslico.com/api",
                            packet: "https://packet.freds.cslico.com/api",
                            marketing: "https://marketing.freds.cslico.com/api",
                            auth: "https://auth.freds.cslico.com/api/:action",
                            groupPlus: 'https://gplus.freds.cslico.com/api',
                             offset: 'https://offset.freds.cslico.com/api'
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ng-constant');

    grunt.registerTask('build', function (env) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
        }
        else if (env === 'dev') {
            grunt.task.run(['ngconstant:development'])
        }
        else if (env === 'prod' || env === 'production') {
            grunt.task.run(['ngconstant:production'])
        }
        else if (env === 'prodprod') {
            grunt.task.run(['ngconstant:prodprod'])
        }
        else if (env === 'qa') {
            grunt.task.run(['ngconstant:qa'])
        }
    });

};
