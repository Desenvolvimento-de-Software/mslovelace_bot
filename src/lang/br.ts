/**
 * Ada Lovelace Telegram Bot
 *
 * This file is part of Ada Lovelace Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  mslovelace_bot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

export default {
    startMessage: "Hey! My name is Ada Lovelace. I used to be a programmer. The first programmer in the history, in fact.\n\nNow I'm here to help you get around and keep the order in your groups.\n\nI have lots of features, such as greetings, a warning system, a flood control system and even more!\n\n",
    startButton: "Adicione-me ao seu grupo",
    helpButton: "Ajuda",
    defaultGreetings: "Olá <a href=\"tg://user?id={userid}\">{username}</a>, te desejo as boas-vindas ao grupo! Em caso de dúvidas, por favor contate um administrador.",
    greetingsStatus: "Status das saudações: {status}",
    captchaStatus: "Status do captcha: {status}",
    warnNameChanging: "<a href=\"tg://user?id={userid}\">{oldname}</a> mudou seu nome para <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand: "<a href=\"tg://user?id={userid}\">{username}</a>, você não está autorizado a enviar este comando aqui.\nEste incidente será reportado.",
    unauthorizedCommandReport: "O usuário <a href=\"tg://user?id={userid}\">{username}</a> está tentando enviar um comando não autorizado em <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>",
    groupStartMessage: "Olá <a href=\"tg://user?id={userid}\">{username}</a>! Me chame no privado se precisar de ajuda.",
    askToAskRegex: /^(algu[eé]?m|preciso)\s(tem|a[kqu]+[ií]\s)?([doesnt]+ grupo\s)?(.*)?(ajuda|duvida|sabe|manja|entende|conhe[cs]|usa|help|m[aã]o|for[cç]a|me[xch]+e)(.*)\??/i,
    askToAskLink: "https://dontasktoask.com/pt-br",
    bannedMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banido.\nMotivo: {reason}",
    unbannedMessage: "Tudo bem. <a href=\"tg://user?id={userid}\">{username}</a> pode se juntar ao grupo novamente.",
    banErrorMessage: "Não foi possível banir o usuário.",
    adaShieldMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banido.\nMotivo: AdaShield.",
    casMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banido.\nMotivo: <a href=\"https://cas.chat/\">CAS</a>.",
    adaShieldStatus: "Status do AdaShield: {status}",
    restrictStatus: "Status da restrição de novos usuários: {status}",
    textEnabled: "ativado",
    textDisabled: "desativado",
    captchaButton: "Pressione aqui para confirmar que não é um robô",
    captchaMessage: "Olá! O grupo <b>{groupName}</b> ativou a proteção contra spam por captcha.\nPara confirmar que você não é um robô, clique no botão abaixo.",
    captchaNotSameUser: "Você não deveria tentar confirmar o captcha para outro usuário.",
    captchaConfirmed: "Captcha confirmado com sucesso!",
    captchaNotConfirmed: "A conta <a href=\"tg://user?id={userid}\">{username}</a> não respondeu ao captcha e foi removida do grupo.",
    emptyGreetingsMessage: "Não existe uma mensagem de boas-vindas configurada.",
    greetingsMessageDemo: "A mensagem de saudação atual é:\n\n{greetings}",
    pongMessage: "Esta sou eu!",
    packageName: "📜 <code>{name}</code>",
    packageVersion: "📂 <code>{version}</code>",
    packageSize: "🗂️ <code>{size}</code>",
    packageDescription: "📝 {description}",
    packageDate: "📆 <code>{date}</code>",
    packageLinks: "🔗 Links:",
    packageLink: " • <a href=\"{linkurl}\">{linkname}</a>",
    packageHomepage: "Página Inicial",
    packageRepository: "🔗 Repository:",
    packageAuthor: "👤 Autor:",
    packagePublisher: "👤 Publicação:",
    packageMaintainers: "👥 Mantenedores:",
    packagePerson: " • {person}",
    packageKeywords: "🏷 Palavras-Chave:",
    packageDependencies: "🖇 Dependências:",
    packageDevDependencies: "🖇 Dependências Dev:",
    npmPackageInstall: "⌨️ Instalação:\n<code>npm install {package}</code>",
    yarnPackageInstall: "⌨️ Instalação:\n<code>yarn add {package}</code>",
    playgroundLink: "🧪 Experimentos:\nhttps://npm.runkit.com/{package}",
    selfReportMessage: "Por que eu me reportaria?",
    adminReportMessage: "Por que eu reportaria um administrador?",
    selfWarnMessage: "Por que eu me daria advertência?",
    adminWarnMessage: "Por que eu daria advertência em um administrador?",
    warningNoneMessage: "✔ <a href=\"tg://user?id={userid}\">{username}</a> não tem advertências.",
    warningSigleMessage: "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> tem {warns} advertências.\n\nMotivo:\n",
    warningPluralMessage: "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> tem {warns} advertências.\n\nMotivos:\n",
    warningBanMessage: "❌ <a href=\"tg://user?id={userid}\">{username}</a> levou ban por ter {warns} advertências.\n\nMotivos:\n",
    warningAdminRemovedLast: "Última advertência de <a href=\"tg://user?id={userid}\">{username}</a> removida por <a href=\"tg://user?id={adminId}\">{adminUsername}</a>.",
    warningAdminRemovedAll: "Todas as advertências de <a href=\"tg://user?id={userid}\">{username}</a> foram removidas por <a href=\"tg://user?id={adminId}\">{adminUsername}</a>.",
    reportMessage: "Reportado aos administradores.",
    federationCreateOnlyPrivate: "Me chame no privado pra criar uma federação.",
    federationCreateSuccess: "Federação <code>{name}</code> criada com sucesso!\nVocê já pode adicionar grupos usando o comando <code>/fjoin {hash}</code>",
    federationCreateError: "Ocorreu um erro ao criar a federação. Por favor, tente novamente mais tarde",
    federationJoinOnlyAdminError: "Somente administradores podem adicionar este grupo a uma federação.",
    federationJoinHasFederationError: "Este grupo já faz parte de uma federação. Para ingressar em outra, use o comando /fleave para sair da atual primeiro.",
    federationJoinNoHashError: "Você precisa informar o hash da federação que deseja ingressar.",
    federationJoinAlreadyJoinedError: "Este grupo já faz parte desta federação.",
    federationJoinError: "Ocorreu um erro ao ingressar na federação. Por favor, tente novamente mais tarde.",
    federationJoinSuccess: "Grupo adicionado à federação {federation} com sucesso!",
    federationLeaveNoFederationError: "Este grupo não faz parte de nenhuma federação.",
    federationLeaveError: "Ocorreu um erro ao sair da federação. Por favor, tente novamente mais tarde.",
    federationLeaveSuccess: "Grupo removido da federação com sucesso!",
    federationCommandOnlyGroupError: "Este comando só pode ser executado em grupos.",
    federationCommandOnlyPrivateError: "Este comando só pode ser usado no privado.",
    federationListEmpty: "Você ainda não criou uma federação.",
    federationListHeader: "Suas federações:\n\n",
    federationListRow: " • <code>{hash}</code> - {description} ({groups} grupos)\n",
    federationDeleteNoHashError: "Você precisa informar o hash da federação que deseja excluir.",
    federationInvalidHashError: "O hash informado não é válido.",
    federationNotOwnerError: "Você não é o dono desta federação.",
    federationDeleteConfirm: "A federação {name} possui {groups} grupos vinculados.\nPara excluir esta federação, envie <code>force</code> como segundo parâmetro.\n\nEx.: <code>/fdelete {hash} force</code>",
    federationDeleteError: "Ocorreu um erro ao excluir a federação. Por favor, tente novamente mais tarde.",
    federationDeleteSuccess: "Federação excluída com sucesso!",
    federationDetails: "Este grupo faz parte da federação {federation} <code>{hash}</code>.",
    fedBannedMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banido na federação.\nMotivo: {reason}",
    fedBanOnlyAdminError: "Somente administradores podem banir usuários da federação.",
    fedBanAdminError: "Você não pode banir administradores da federação.",
    macroNoMacroFound: "A lista de macros está vazia.\nPara adicionar uma macro, use o comando <code>/madd</code> .",
    macroMalformedCommandError: "Para adicionar uma nova macro, utilize o seguinte comando:\n<code>/madd {macro} {conteúdo}</code>",
    macroList: "As seguintes macros estão disponíveis:\n\n",
    macroAlreadyExists: "A macro {macro} já existe.",
    macroAddError: "Ocorreu um erro ao adicionar a macro. Por favor, tente novamente mais tarde.",
    macroRemoveError: "Ocorreu um erro ao remover a macro. Por favor, tente novamente mais tarde.",
    lastWarningRemovalButton: "Remover Advertência (somente admins)",
    warningsRemovalButton: "Remover todas as advertências (somente admins)",
    adminOnlyAction: "Esta ação só pode ser executada por administradores.",
    adminOnlyActionMessage: "<a href=\"tg://user?id={userid}\">{username}</a> você sabe o que quer dizer \"somente admins\"? O que você pensa que está fazendo?",
    reasonUnknown: "Desconhecido",
    rulesNotFound: "Não há regras configuradas para este grupo.",
    rulesDeleted: "As regras do grupo foram removidas.",
    rulesUpdated: "As regras do grupo foram atualizadas.",
    privacyPolicy: (() => [
        "Olá! Eu sou a Ada Lovelace, um bot pro Telegram. Estou aqui para ajudar, mas antes, é importante que você saiba como trato seus dados.",
        "<b>Coleta de Dados:</b> Eu salvo e mantenho apenas dados públicos dos usuários e grupos dos quais faço parte. Isso inclui mensagens enviadas em grupos e informações de perfil público.",
        "<b>Uso dos Dados:</b> Os dados coletados são usados exclusivamente para que eu possa gerenciar os grupos dos quais faço parte.",
        "<b>Compartilhamento de Dados:</b> Eu não compartilho seus dados com terceiros. As informações coletadas ficam restritas ao funcionamento do bot.",
        "<b>Segurança:</b> Tomo medidas para garantir que seus dados estejam seguros, protegendo-os contra acesso não autorizado.",
        "<b>Seus Direitos:</b> Você tem o direito de solicitar a exclusão de seus dados a qualquer momento. Para isso, basta entrar em contato comigo através deste canal.",
        "Se tiver alguma dúvida sobre esta política de privacidade, estou à disposição para ajudar!"
    ].join("\n\n"))()
};
