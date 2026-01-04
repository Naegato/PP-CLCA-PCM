import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';
import { Email } from '@pp-clca-pcm/domain/value-objects/email';
import { randomUUID } from 'node:crypto';
export class User {
    identifier;
    firstname;
    lastname;
    email;
    password;
    clientProps;
    advisorProps;
    directorProps;
    constructor(identifier, firstname, lastname, email, password, clientProps, advisorProps, directorProps) {
        this.identifier = identifier;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.clientProps = clientProps;
        this.advisorProps = advisorProps;
        this.directorProps = directorProps;
    }
    static create(firstname, lastname, email, password) {
        const emailOrError = Email.create(email);
        if (emailOrError instanceof Error) {
            return emailOrError;
        }
        const passwordOrError = Password.create(password);
        if (passwordOrError instanceof Error) {
            return passwordOrError;
        }
        return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, new ClientProps());
    }
    static createAdvisor(firstname, lastname, email, password) {
        const emailOrError = Email.create(email);
        if (emailOrError instanceof Error) {
            return emailOrError;
        }
        const passwordOrError = Password.create(password);
        if (passwordOrError instanceof Error) {
            return passwordOrError;
        }
        return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, undefined, new AdvisorProps());
    }
    static createDirector(firstname, lastname, email, password) {
        const emailOrError = Email.create(email);
        if (emailOrError instanceof Error) {
            return emailOrError;
        }
        const passwordOrError = Password.create(password);
        if (passwordOrError instanceof Error) {
            return passwordOrError;
        }
        return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, undefined, undefined, new DirectorProps());
    }
    update(props) {
        return new User(this.identifier, props.firstname ?? this.firstname, props.lastname ?? this.lastname, props.email ?? this.email, props.password ?? this.password, this.clientProps, this.advisorProps, this.directorProps);
    }
    static createFromRaw(identifier, firstname, lastname, email, password, clientProps, advisorProps, directorProps) {
        return new User(identifier, firstname, lastname, Email.create(email), Password.create(password), clientProps, advisorProps, directorProps);
    }
    updateClientProps(props) {
        return new User(this.identifier, this.firstname, this.lastname, this.email, this.password, props, this.advisorProps, this.directorProps);
    }
    updateAdvisorProps(props) {
        return new User(this.identifier, this.firstname, this.lastname, this.email, this.password, this.clientProps, props, this.directorProps);
    }
    updateDirectorProps(props) {
        return new User(this.identifier, this.firstname, this.lastname, this.email, this.password, this.clientProps, this.advisorProps, props);
    }
    isAdvisor() {
        return this.advisorProps !== undefined;
    }
    isDirector() {
        return this.directorProps !== undefined;
    }
    isClient() {
        return this.clientProps !== undefined;
    }
    static fromPrimitives(primitives) {
        return new User(primitives.identifier, primitives.firstname, primitives.lastname, Email.create(primitives.email), Password.create(primitives.password), primitives.clientProps, primitives.advisorProps, primitives.directorProps);
    }
}
//# sourceMappingURL=user.js.map