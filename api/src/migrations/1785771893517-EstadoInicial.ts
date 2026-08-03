import { MigrationInterface, QueryRunner } from "typeorm";

export class EstadoInicial1785771893517 implements MigrationInterface {
    name = 'EstadoInicial1785771893517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sprint\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(50) NOT NULL, \`data_inicio\` date NOT NULL, \`data_fim\` date NOT NULL, \`status\` enum ('cancelada', 'planejada', 'em_andamento', 'concluida') NOT NULL DEFAULT 'planejada', \`projeto_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`atividade\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(50) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`data_inicio\` date NOT NULL, \`data_fim\` date NOT NULL, \`etapa\` enum ('backlog', 'desenvolvimento', 'impedimento', 'aprovacao', 'finalizada') NOT NULL DEFAULT 'backlog', \`arquivada\` tinyint NOT NULL DEFAULT 0, \`projeto_id\` int NOT NULL, \`sprint_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`atividade_responsavel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`atividade_id\` int NOT NULL, \`usuario_id\` int NULL, \`equipe_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`equipe\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(50) NOT NULL, \`projeto_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projeto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(50) NOT NULL, \`descricao\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projeto_usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`papel\` enum ('product_owner', 'scrum_master', 'developer') NOT NULL, \`usuario_id\` int NOT NULL, \`projeto_id\` int NOT NULL, UNIQUE INDEX \`IDX_fd889a88cb8c9024cb1290753d\` (\`usuario_id\`, \`projeto_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`senha\` varchar(255) NULL, \`google_id\` varchar(255) NULL, \`foto_perfil\` varchar(500) NULL, \`email_verificado\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_2863682842e688ca198eb25c12\` (\`email\`), UNIQUE INDEX \`IDX_3d66f5587e892b8f3ef6f4a207\` (\`google_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`convite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(36) NOT NULL, \`email\` varchar(255) NULL, \`papel\` enum ('product_owner', 'scrum_master', 'developer') NOT NULL DEFAULT 'developer', \`expires_at\` datetime NOT NULL, \`usado_em\` datetime NULL, \`projeto_id\` int NOT NULL, UNIQUE INDEX \`IDX_4456ab9571180e4a4ad0c7d5a6\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`equipe_usuario\` (\`equipe_id\` int NOT NULL, \`usuario_id\` int NOT NULL, INDEX \`IDX_c0b223433a3416c66112556c43\` (\`equipe_id\`), INDEX \`IDX_d993c2281fa2f14061cb0161d9\` (\`usuario_id\`), PRIMARY KEY (\`equipe_id\`, \`usuario_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sprint\` ADD CONSTRAINT \`FK_b816137c7cffab1419aa15907e4\` FOREIGN KEY (\`projeto_id\`) REFERENCES \`projeto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atividade\` ADD CONSTRAINT \`FK_dd09834500533ae3db4b5480d00\` FOREIGN KEY (\`projeto_id\`) REFERENCES \`projeto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atividade\` ADD CONSTRAINT \`FK_177fa66b7e014dcf432c006ff2a\` FOREIGN KEY (\`sprint_id\`) REFERENCES \`sprint\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` ADD CONSTRAINT \`FK_4c0a8183a5384d303c874fa31df\` FOREIGN KEY (\`atividade_id\`) REFERENCES \`atividade\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` ADD CONSTRAINT \`FK_92ba3e26d5caf2c9056588eddaa\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` ADD CONSTRAINT \`FK_02d70d1f5e6d065619ef1e22260\` FOREIGN KEY (\`equipe_id\`) REFERENCES \`equipe\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`equipe\` ADD CONSTRAINT \`FK_1b13f11540279f852b9c891b0a1\` FOREIGN KEY (\`projeto_id\`) REFERENCES \`projeto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projeto_usuario\` ADD CONSTRAINT \`FK_ec3526da55c65cdf017b8680a6a\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projeto_usuario\` ADD CONSTRAINT \`FK_67a72c41666c0e9e2563a363842\` FOREIGN KEY (\`projeto_id\`) REFERENCES \`projeto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`convite\` ADD CONSTRAINT \`FK_3fa7c08fa0df6a95fa975b5f0a2\` FOREIGN KEY (\`projeto_id\`) REFERENCES \`projeto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`equipe_usuario\` ADD CONSTRAINT \`FK_c0b223433a3416c66112556c43a\` FOREIGN KEY (\`equipe_id\`) REFERENCES \`equipe\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`equipe_usuario\` ADD CONSTRAINT \`FK_d993c2281fa2f14061cb0161d97\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`equipe_usuario\` DROP FOREIGN KEY \`FK_d993c2281fa2f14061cb0161d97\``);
        await queryRunner.query(`ALTER TABLE \`equipe_usuario\` DROP FOREIGN KEY \`FK_c0b223433a3416c66112556c43a\``);
        await queryRunner.query(`ALTER TABLE \`convite\` DROP FOREIGN KEY \`FK_3fa7c08fa0df6a95fa975b5f0a2\``);
        await queryRunner.query(`ALTER TABLE \`projeto_usuario\` DROP FOREIGN KEY \`FK_67a72c41666c0e9e2563a363842\``);
        await queryRunner.query(`ALTER TABLE \`projeto_usuario\` DROP FOREIGN KEY \`FK_ec3526da55c65cdf017b8680a6a\``);
        await queryRunner.query(`ALTER TABLE \`equipe\` DROP FOREIGN KEY \`FK_1b13f11540279f852b9c891b0a1\``);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` DROP FOREIGN KEY \`FK_02d70d1f5e6d065619ef1e22260\``);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` DROP FOREIGN KEY \`FK_92ba3e26d5caf2c9056588eddaa\``);
        await queryRunner.query(`ALTER TABLE \`atividade_responsavel\` DROP FOREIGN KEY \`FK_4c0a8183a5384d303c874fa31df\``);
        await queryRunner.query(`ALTER TABLE \`atividade\` DROP FOREIGN KEY \`FK_177fa66b7e014dcf432c006ff2a\``);
        await queryRunner.query(`ALTER TABLE \`atividade\` DROP FOREIGN KEY \`FK_dd09834500533ae3db4b5480d00\``);
        await queryRunner.query(`ALTER TABLE \`sprint\` DROP FOREIGN KEY \`FK_b816137c7cffab1419aa15907e4\``);
        await queryRunner.query(`DROP INDEX \`IDX_d993c2281fa2f14061cb0161d9\` ON \`equipe_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_c0b223433a3416c66112556c43\` ON \`equipe_usuario\``);
        await queryRunner.query(`DROP TABLE \`equipe_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_4456ab9571180e4a4ad0c7d5a6\` ON \`convite\``);
        await queryRunner.query(`DROP TABLE \`convite\``);
        await queryRunner.query(`DROP INDEX \`IDX_3d66f5587e892b8f3ef6f4a207\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_2863682842e688ca198eb25c12\` ON \`usuario\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_fd889a88cb8c9024cb1290753d\` ON \`projeto_usuario\``);
        await queryRunner.query(`DROP TABLE \`projeto_usuario\``);
        await queryRunner.query(`DROP TABLE \`projeto\``);
        await queryRunner.query(`DROP TABLE \`equipe\``);
        await queryRunner.query(`DROP TABLE \`atividade_responsavel\``);
        await queryRunner.query(`DROP TABLE \`atividade\``);
        await queryRunner.query(`DROP TABLE \`sprint\``);
    }

}
